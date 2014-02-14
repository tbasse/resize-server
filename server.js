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
