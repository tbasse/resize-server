'use strict';

var fs                 = require('fs'),
    url                = require('url'),
    exec               = require('child_process').exec,
    crypto             = require('crypto'),
    request            = require('request'),
    // q                  = require('q'),
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

ResizeJob.prototype.downloadRemoteImage = function () {
  var fsStream = fs.createWriteStream(this.tmpFilePath);

  fsStream.on('close', function () {
    this.convertImage();
  }.bind(this));

  request(this.options.url, function (err, res, body) {
    if (err && err.errno === 'ENOTFOUND') {
      this.callback({
        status: 404,
        url: this.options.url
      });
    } else if (err) {
      this.callback({
        status: 500,
        url: this.options.url
      });
    }
    if (res.statusCode !== 200) {
      this.callback({
        status: res.statusCode,
        url: this.options.url
      });
    }
  }).pipe(fsStream);
};

ResizeJob.prototype.convertImage = function () {
  var execCmd,
      execParam,
      im;

  im = new ImageMagickCommand(
    this.options,
    {
      tmp: this.tmpFilePath,
      cache: this.cacheFilePath
    },
    config.convertCmd
  );

  execCmd   = im.buildCommandString();
  execParam = {
    maxBuffer: 1000 * 1024,
    timeout: 512 * 1000
  };

  exec(execCmd, execParam, function (err, stdout, stderr) {
    if (err) {
      log.write(stderr);
      return this.callback({
        status: 500,
        message: 'Internal Server Error'
      });
    }
    fs.unlink(this.tmpFilePath, function (err) {
      if (err) {
        log.write(err);
      }
      log.write(new Date() + ' - RESIZE DONE: ' + this.options.imagefile);
      this.callback(null, this.cacheFilePath);
    }.bind(this));
  }.bind(this));
};

ResizeJob.prototype.validateRemoteSource = function () {
  // if remote url hast no hostname end with status 400
  if (! url.parse(this.options.url).hostname) {
    this.callback({
      status: 400,
      url: this.options.url
    });
    return false;
  } else {
    return true;
  }
};

ResizeJob.prototype.startResize = function () {
  if (this.validateRemoteSource) {
    this.downloadRemoteImage();
  }
};

module.exports = {
  'ResizeJob': ResizeJob
};
