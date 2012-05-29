var fs = require('fs');
var path = require('path');

var girror = require('girror');
var http_proxy = require('http-proxy');
var spinner = require('spinner').createSpinner({ monitor: null });

var npm = require('./npm');

module.exports = function(url, options) {
  options = options || {};
  var main = options.main || 'app.js';
  var hook = options.hook || null;
  var build = options.build || npm;

  var salt = Math.round(Math.random() * 1000000);
  var workdir = path.join('/tmp', 'connect-girror', salt.toString(), url.replace(/[\/\/\:\?\&]/g, '_'));
  var proxy = new http_proxy.RoutingProxy();
  var child = null;
  var handler = null;

  function mk_error_handler(status, message) {
    return function(req, res, next) {
      res.writeHead(status);
      return res.end(message);
    };
  }

  function set_handler(new_handler) {
    handler = new_handler;
    return handler;
  }

  set_handler(mk_error_handler(503)); // service unavailable

  var in_progress = false;

  function deploy() {
    if (in_progress) return false; // no concurrent deploys
    in_progress = true;

    return girror(url, workdir, function(err) {
      if (err) {
        in_progress = false;
        return set_handler(mk_error_handler(500, err.toString()));
      }

      var main_module = path.join(workdir, main);

      return path.exists(main_module, function(exists) {

        // server error if `main` does not exist
        if (!exists) {
          in_progress = false;
          return set_handler(mk_error_handler(500, main + ' not found in ' + url));
        }

        return build(workdir, function(err) {

          if (err) {
            in_progress = false;
            return set_handler(mk_error_handler(500, err.toString()));
          }
          
          // restart child after it was updated
          return spinner.stop(main_module, function() {
            return spinner.start(main_module, function(err) {
              in_progress = false;

              if (err) {
                return set_handler(mk_error_handler(500, err.toString()));
              }

              return set_handler(function(req, res, next) {
                var buffer = http_proxy.buffer(req); // cache incoming data before of async call

                // call start on every request for idle timeout
                return spinner.start(main_module, function(err, socket) {
                  return proxy.proxyRequest(req, res, {
                    host: 'localhost',
                    port: socket,
                    buffer: buffer,
                  });
                });
              });
            });
          });

        });
      });
    });
  }

  deploy();

  return function(req, res, next) {
    if (hook && req.url === hook) {
      if (req.method === 'POST') {
        deploy();
        return res.end();
      }
      else {
        res.writeHead(405);
        return res.end();
      }
    }

    return handler(req, res, next);
  };
};

exports.npm = npm; // export `npm` so it can be reused