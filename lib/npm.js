var path = require('path');
var exec = require('child_process').exec;

module.exports = function(options) {
  options = options || {};
  var verbose = 'verbose' in options ? options.verbose : false;

  return function(dir, callback) {
    var package_json = path.join(dir, 'package.json');
    return fs.exists(package_json, function(exists) {
      if (!exists) {
        return callback();
      }

      var child = exec('npm install', { cwd: dir }, function(err, stdout, stderr) {
        
        // if npm doesn't exist, ignore
        if (err && err.code === 127) {
          return callback();
        }

        return callback(err);
      });

      child.stdout.pipe(process.stdout);

      if (verbose) {
        child.stderr.pipe(process.stderr);
      }

      return child;
    });
  };
};