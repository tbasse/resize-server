'use strict';

var express         = require('express');
var fs              = require('fs');
var config          = require('./config');
var log             = require('./lib/log');
var RequestSplitter = require('./lib/requestsplitter');
var ResizeJob       = require('./lib/resize').ResizeJob;

if (!fs.existsSync(config.cacheDirectory)) {
  fs.mkdirSync(config.cacheDirectory);
}

var app  = express();
app.use(express.bodyParser())
   .set('view engine', 'jade')
   .set('views', __dirname + '/views');

app.use(function (req, res, next) {
  res.removeHeader('X-Powered-By');
  next();
});

app.get('/health', function (req, res) {
  res.send('OK').end();
});

app.get('/', function (req, res) {
  var params = {
    layout: false,
    hostname: req.headers.host
  };
  res.render('help', params);
});

app.get(RequestSplitter.urlMatch, function (req, res) {
  var now,
      jobStartTime,
      jobEndTime,
      jobDuration;

  now = jobStartTime = new Date().getTime();
  var rs = new RequestSplitter(req.path, req.query);
  var rj = new ResizeJob(rs.mapOptions(), function (err, file, cached) {
    if (err) {
      res.json(err.status, err);
    } else {
      jobEndTime = new Date().getTime();
      jobDuration = jobEndTime - jobStartTime;

      if (cached) {
        jobDuration = 0;
      }
      res.header('X-ResizeJobDuration', jobDuration);
      res.header('Expires', new Date(now + config.cacheHeader.expires));
      res.sendfile(file, {maxAge: config.cacheHeader.maxAge});
    }
  });

  rj.startResize();
});

log.write('resize server listening on ' + config.appPort);
app.listen(config.appPort);
