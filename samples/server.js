var exec = require('child_process').exec;
var girror = require('..');
var connect = require('connect');
var path = require('path');

process.chdir(__dirname);

exec('tar -xf foo_repo.tar', function(err) {
    if (err) throw err;

    var app = connect.createServer();
    var secret = '/bhmn489dkjh8m';
    var foo_path = path.join(__dirname, 'foo_repo');
    app.use('/foo', girror(foo_path, { verbose: true, hook: secret }));
    app.use('/goo', girror(foo_path + '#goo', { verbose: true, hook: secret }));
    app.use('/', function(req, res, next) {
        res.write('GET /foo and GET /goo will proxy the request to the app\n');
        res.write('POST /foo' + secret + ' and POST /goo' + secret + ' will redeploy\n');
        return res.end();
    });

    app.listen(5000);
    console.log('listening on 5000');
});


