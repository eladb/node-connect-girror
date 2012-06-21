var girror = require('..');
var connect = require('connect');
var path = require('path');

var app = connect.createServer();

var foo_path = path.join(__dirname, 'foo_repo');
var secret = '/bhmn489dkjh8m';

app.use('/foo', girror(foo_path, { verbose: true, hook: secret }));

app.use('/', function(req, res, next) {
  return res.end('Send an HTTP POST to /foo/' + secret + ' to deploy\n');
});

app.listen(5000);
console.log('listening on 5000');