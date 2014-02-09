'use strict';

var express         = require('express'),
    config          = require('./config'),
    log             = require('./lib/log'),
    RequestSplitter = require('./lib/requestsplitter'),
    ResizeJob       = require('./lib/resize').ResizeJob;

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

app.get(RequestSplitter.urlMatch, function (req, res) {
  var rs = new RequestSplitter(req.path, req.query);
  var rj = new ResizeJob(rs.mapOptions(), function (err, file) {
    if (err) {
      res.json(err.status, err);
    } else {
      res.header('Expires:', new Date(new Date().getTime() + 1209600000));
      res.sendfile(file, {maxAge: 315360000});
    }
  });

  rj.startResize();

});

log.write('resize server listening on ' + config.appPort);
app.listen(config.appPort);
