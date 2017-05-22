var express = require('express');
var path = require('path');
var app = new (express)();
var httpProxy = require('http-proxy');

var port = 3061;
var targetUrl = 'http://47.93.224.216:' + port;
var proxy = httpProxy.createProxyServer({
  target: targetUrl
});

app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/dist/static')));

app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.listen(8001,function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Server is listening on port %s. Open up http://localhost:%s/ in your browser.", 8000, 8000)
  }
});

