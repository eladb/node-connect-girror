var girror = require('..');
var connect = require('connect');
var path = require('path');

var app = connect.createServer();

var foo_path = path.join(__dirname, 'foo_repo');

var foo = girror(foo_path, { hook: '/bhmn489dkjh8m' });

app.use('/foo', foo);

app.use('/goo', function(req, res, next) {
  return res.end('goo!\n');
})

app.listen(5000);
console.log('listening on 5000');