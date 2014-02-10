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
  var shasum,
      cacheFile;

  shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(this.options));
  cacheFile = shasum.digest('hex') + '.' + this.options.format;

  return cacheFile;
};

ResizeJob.prototype.isAlreadyCached = function (filename, cb) {
  fs.exists(filename, function (exists) {
    cb(exists);
  });
};

ResizeJob.prototype.validateRemoteSource = function () {
  // if remote url hast no hostname end with status 400
  if (! url.parse(this.options.url).hostname) {
    return false;
  } else {
    return true;
  }
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

  convert = spawn('convert', im.buildCommandString());
  convert.stdout.pipe(cacheFileStream);
  convert.on('close', function (e) {
    this.callback(null, this.cacheFilePath);
  }.bind(this));

  request(source, function (err, res, body) {
    if (err && err.errno === 'ENOTFOUND') {
      this.callback({status: 404, url: source});
    } else if (err) {
      this.callback({status: 500, url: source});
    }
    if (res.statusCode !== 200) {
      this.callback({status: res.statusCode, url: source});
    }
  }).pipe(convert.stdin);
};

ResizeJob.prototype.startResize = function () {

  if (! this.validateRemoteSource()) {
    // if remote url hast no hostname end with status 400
    return this.callback({status: 400, url: this.options.url});
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

};

module.exports = {
  'ResizeJob': ResizeJob
};
