'use strict';

var fs      = require('fs'),
    url     = require('url'),
    exec    = require('child_process').exec,
    crypto  = require('crypto'),
    request = require('request'),
    step    = require('step'),
    log     = require('./log'),
    helper  = require('./helper.js'),
    config  = require('../config');

/**
 * Build string for cached filename from resize options
 *
 * @return {String} cache filename
 */
function generateCacheFilename() {}


/**
 * Build resize options from request parameters
 *
 * @return {Object} resize parameters
 */
function generateResizeOptions() {}


/**
 * Check if there's already a cached file for the requested remote image
 *
 * @return {Boolean}
 */
function doesCacheFileExist() {}


/**
 * Build ImageMagick convert command
 *
 * @return {String} imagemagick convert command
 */
function buildImageMagickCommand() {}

function downloadRemoteImage() {}

function resizeImage() {}


function resize(param, cb) {

  var execCmd,
      execParam,
      cacheFile,
      tmpFile,
      shasum,
      getParam;

  getParam = [];
  for (var i in param.query) {
    if (param.query.hasOwnProperty(i)) {
      getParam.push(i + ':' + param.query[i]);
    }
  }
  getParam = getParam.join('&');

  var options = {
    action:  param[1] === 'c' ? 'crop' : 'resize',
    width:   param[1] === 'h' ? '' : param[2],
    height:  param[1] === 'w' ? '' : param[1] === 'h' ? param[2] : param[3],
    gravity: param[4] || 'c',
    format:  param[5] || 'jpg',
    quality: param[6] || 80,
    url: param[7] + '?' + getParam
  };
  options.quality = options.quality > 100 ? 100 : options.quality;
  // get suffix from url without request params
  options.suffix = helper.getFileSuffix(param[7]);

  if (! url.parse(options.url).hostname) {
    return cb({status: 400, url: options.url});
  }

  shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(options));
  cacheFile = shasum.digest('hex') + '.' + options.format;
  tmpFile = config.tmpDirectory + cacheFile + '_tmp.' + options.suffix;

  step(

    function stepExistCacheFile() {
      var next = this;
      fs.exists(config.cacheDirectory + cacheFile, function (exists) {
        if (exists) {
          log.write(new Date() + ' - CACHE HIT: ' + options.url);
          return cb(null, config.cacheDirectory + cacheFile);
        }
        log.write(new Date() + ' - RESIZE STARTED: ' + options.url);
        next();
      });
    },

    function stepBuildConvertCommand() {
      var next = this;

      var gravity = {
        nw: 'NorthWest',
        n: 'North',
        ne: 'NorthEast',
        w: 'West',
        c: 'Center',
        e: 'East',
        sw: 'SouthWest',
        s: 'South',
        se: 'SouthEast'
      };

      if (options.action === 'crop') {
        execCmd = [
          config.convertCmd,
          tmpFile,
          '-auto-orient -strip',
          '-thumbnail "' + options.width + 'x' + options.height + '^>"',
          '-gravity ' + gravity[options.gravity],
          '-crop "' + options.width + 'x' + options.height + '+0+0"',
          '+repage',
          '-quality ' + options.quality,
          '-format ' + options.format,
          '-background white',
          '-flatten',
          config.cacheDirectory + cacheFile
        ].join(' ');
      } else if (options.width && options.height) {
        execCmd = [
          config.convertCmd,
          tmpFile,
          '-auto-orient -strip',
          '-scale "' + options.width + 'x' + options.height + '!"',
          '+repage',
          '-quality ' + options.quality,
          '-format ' + options.format,
          '-background white',
          '-flatten',
          config.cacheDirectory + cacheFile
        ].join(' ');
      } else {
        execCmd = [
          config.convertCmd,
          tmpFile,
          '-auto-orient -strip',
          '-resize "' + options.width + 'x' + options.height + '"',
          '+repage',
          '-quality ' + options.quality,
          '-format ' + options.format,
          '-background white',
          '-flatten',
          config.cacheDirectory + cacheFile
        ].join(' ');
      }
      execParam = {
        maxBuffer: 1000 * 1024,
        timeout: 512 * 1000
      };
      next();
    },

    function stepDownloadImage() {
      var next = this;

      var fsStream = fs.createWriteStream(tmpFile);
      fsStream.on('close', function () {
        next();
      });
      request(options.url, function (err, res, body) {
        if (err && err.errno === 'ENOTFOUND') {
          return cb({status: 404, url: options.url});
        } else if (err) {
          return cb({status: 500, url: options.url});
        }
        if (res.statusCode !== 200) {
          return cb({status: res.statusCode, url: options.url});
        }
      }).pipe(fsStream);
    },

    function stepConvertImage(err) {
      if (err) {
        return cb({
          status: 500,
          error: err
        });
      }
      exec(execCmd, execParam, function (err, stdout, stderr) {
        if (err) {
          log.write(stderr);
          return cb({
            status: 500,
            message: 'Internal Server Error'
          });
        }
        fs.unlink(tmpFile, function (er) {
          if (er) {
            log.write(er);
          }
          log.write(new Date() + ' - RESIZE DONE: ' + options.url);
          cb(null, config.cacheDirectory + cacheFile);
        });
      });
    }

  );

}

module.exports = {
  'resize': resize,
};
