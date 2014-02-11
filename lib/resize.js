'use strict';

var fs                 = require('fs'),
    url                = require('url'),
    spawn              = require('child_process').spawn,
    crypto             = require('crypto'),
    request            = require('request'),
    log                = require('./log'),
    config             = require('../config'),
    ImageMagickCommand = require('./imagemagickcommand');

function ResizeJob(options, callback) {
  this.options  = options || {};
  this.callback = callback;

  this.cacheFileName = this.generateCacheFilename();
  this.tmpFileName   = this.cacheFileName + '_tmp' + this.options.suffix;
  this.cacheFilePath = config.cacheDirectory + this.cacheFileName;
  this.tmpFilePath   = config.tmpDirectory + this.tmpFileName;
}

ResizeJob.prototype.generateCacheFilename = function () {
  return crypto.createHash('sha1')
    .update(JSON.stringify(this.options))
    .digest('hex') + '.' + this.options.format;
};

ResizeJob.prototype.isAlreadyCached = function (filename, cb) {
  fs.exists(filename, function (exists) {
    cb(exists);
  });
};

ResizeJob.prototype.validateRemoteSource = function (cb) {
  // if remote url hast no hostname end with status 400
  if (! url.parse(this.options.url).hostname) {
    return cb(400);
  }

  var options = {
    url: this.options.url,
    timeout: 5000
  };
  request.head(options, function (err, res, body) {
    if (err) {
      // head request returned error
      if (err.code === 'ETIMEDOUT') {
        cb('ETIMEDOUT');
      } else {
        cb(500);
      }
    } else if (res.statusCode === 404) {
      // return 404 on not found urls
      cb(404);
    } else if (res.headers['content-type'].split('/')[0] !== 'image') {
      // content-type ist not image
      cb(415);
    } else if (res.statusCode !== 200) {
      // anything else but 200
      cb(res.statusCode);
    } else {
      cb(200);
    }
  });
};

ResizeJob.prototype.resizeStream = function () {
  var source = this.options.url;
  var cacheFileStream = fs.createWriteStream(this.cacheFilePath);
  var im, convert;

  im = new ImageMagickCommand(
    this.options,
    {
      tmp: '-',
      cache: '-'
    },
    config.convertCmd
  );

  convert = spawn(config.convertCmd, im.buildCommandString());
  convert.stdout.pipe(cacheFileStream);
  convert.on('close', function (e) {
    this.callback(null, this.cacheFilePath);
  }.bind(this));

  request(source).pipe(convert.stdin);
};

ResizeJob.prototype.startResize = function () {
  this.validateRemoteSource(function (status) {
    if (status !== 200) {
      console.log(status);
      return this.callback({status: status, url: this.options.url});
    }

    this.isAlreadyCached(this.cacheFilePath, function (exists) {
      if (exists) {
        log.write(new Date() + ' - CACHE HIT: ' + this.options.imagefile);
        this.callback(null, this.cacheFilePath, true);
      } else {
        log.write(new Date() + ' - RESIZE START: ' + this.options.imagefile);
        this.resizeStream();
      }
    }.bind(this));

  }.bind(this));
};

module.exports = {
  'ResizeJob': ResizeJob
};
