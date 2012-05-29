var path = require('path');
var exec = require('child_process').exec;

module.exports = function(dir, callback) {
  var package_json = path.join(dir, 'package.json');
  return path.exists(package_json, function(exists) {
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
    child.stderr.pipe(process.stderr);

    return child;
  });
};