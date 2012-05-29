# connect-girror

[![Build Status](https://secure.travis-ci.org/eladb/node-connect-girror.png?branch=master)](http://travis-ci.org/eladb/node-connect-girror)

Tiny little connect middleware to mount and auto-deploy apps from a git repository. Pretty cool.

```bash
$ npm install connect-girror
```

The sample below "mounts" the GitHub repository https://github.com/eladb/foo into the `/foo`
route on the connect/express server. When the program is started, [girror](https://github.com/eladb/node-girror) is used to check out a local copy of this repository and [spinner](https://github.com/eladb/node-spinner) is used to spawn `app.js` from this repository and keep it alive. HTTP requests into this route are proxied using [http-proxy](https://github.com/nodejitsu/node-http-proxy) into the child app.

```js
var connect = require('connect');
var girror = require('connect-girror');

var app = connect.createServer();
app.use('/foo', girror('https://github.com/eladb/foo'));
app.get('/', function(req, res) {
  res.end('Nothing to see here. Try /foo\n');
});
app.listen(5000);
```

A working example is available under `samples` (start with `node server`).

# The MIT License

Copyright (c) 2012 Elad Ben-Israel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
