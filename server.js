'use strict';

var express = require('express'),
    config  = require('./config'),
    log     = require('./lib/log'),
    resize  = require('./lib/resize');

var app  = express();
app.use(express.bodyParser())
   .set('view engine', 'jade')
   .set('views', __dirname + '/views');

app.use(function (req, res, next) {
  res.removeHeader('X-Powered-By');
  next();
});

app.get('/', function (req, res) {
  var params = {
    layout: false
  };
  res.render('help', params);
});

var resizeRequest = [
    '^\/?([0-9a-zA-Z]+)?\/',
    '(c|w|h)?([0-9]+)x?([0-9]+)?,?',
    '(e|w|n(?:e|w)?|s(?:e|w)?)?\/?',
    '(png|jpg)?,?([0-9]+)?\/(.*)$'
  ].join('');
resizeRequest = new RegExp(resizeRequest);

app.get(resizeRequest, function (req, res) {
  resize.resize(req.params, function (err, file) {
    if (err) {
      res.json(err.status, err);
    } else {
      res.sendfile(file);
    }
  });
});

log.write('resize server listening on ' + config.appPort);
app.listen(config.appPort);


