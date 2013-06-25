'use strict';

var fs      = require('fs'),
    url     = require('url'),
    exec    = require('child_process').exec,
    crypto  = require('crypto'),
    request = require('request'),
    log     = require('./log'),
    helper  = require('./helper.js'),
    config  = require('../config');

/**
 * Build resize options from request parameters
 *
 * @return {Object} resize parameters
 */
function generateResizeOptions(param) {
  var getParam = [],
      options;

  for (var i in param.query) {
    if (param.query.hasOwnProperty(i)) {
      getParam.push(i + ':' + param.query[i]);
    }
  }
  getParam = getParam.join('&');

  options = {
    action:  param[1] === 'c' ? 'crop' : 'resize',
    width:   param[1] === 'h' ? '' : param[2],
    height:  param[1] === 'w' ? '' : param[1] === 'h' ? param[2] : param[3],
    gravity: param[4] || 'c',
    format:  param[5] || 'jpg',
    quality: param[6] || 80,
    imagefile: param[7],
    url: param[7] + '?' + getParam
  };

  options.quality = options.quality > 100 ? 100 : options.quality;
  options.suffix = helper.getFileSuffix(options.imagefile);

  return options;
}


/**
 * Build string for cached filename from resize options
 *
 * @return {String} cache filename
 */
function generateCacheFilename(options) {
  var shasum,
      cacheFile;

  shasum = crypto.createHash('sha1');
  shasum.update(JSON.stringify(options));
  cacheFile = shasum.digest('hex') + '.' + options.format;

  return cacheFile;
}


/**
 * Build ImageMagick convert command
 *
 * @return {String} imagemagick convert command
 */
function buildImageMagickCommand(options, tmpFile, cacheFile) {
  var gravityName,
      imageMagickCmd;

  gravityName = {
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
    imageMagickCmd = [
      config.convertCmd,
      tmpFile,
      '-auto-orient -strip',
      '-thumbnail "' + options.width + 'x' + options.height + '^>"',
      '-gravity ' + gravityName[options.gravity],
      '-crop "' + options.width + 'x' + options.height + '+0+0"',
      '+repage',
      '-quality ' + options.quality,
      '-format ' + options.format,
      '-background white',
      '-flatten',
      config.cacheDirectory + cacheFile
    ];
  } else if (options.width && options.height) {
    imageMagickCmd = [
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
    ];
  } else {
    imageMagickCmd = [
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
    ];
  }

  return imageMagickCmd.join(' ');
}


function resize(param, cb) {

  var cacheFile,
      tmpFile,
      options;

  options = generateResizeOptions(param);

  if (! url.parse(options.url).hostname) {
    // if remote url hast no hostname end with status 400
    return cb({status: 400, url: options.url});
  }

  cacheFile = generateCacheFilename(options);
  tmpFile   = config.tmpDirectory + cacheFile + '_tmp.' + options.suffix;

  fs.exists(config.cacheDirectory + cacheFile, function (exists) {
    if (exists) {
      log.write(new Date() + ' - CACHE HIT: ' + options.url);
      return cb(null, config.cacheDirectory + cacheFile);
    }
    log.write(new Date() + ' - RESIZE STARTED: ' + options.url);
    downloadRemoteImage();
  });


  function downloadRemoteImage() {
    var fsStream = fs.createWriteStream(tmpFile);

    fsStream.on('close', function () {
      resizeImageWithImageMagick();
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
  }

  function resizeImageWithImageMagick() {
    var execCmd,
        execParam;

    execCmd = buildImageMagickCommand(options, tmpFile, cacheFile);
    execParam = {
      maxBuffer: 1000 * 1024,
      timeout: 512 * 1000
    };

    exec(execCmd, execParam, function (err, stdout, stderr) {
      if (err) {
        log.write(stderr);
        return cb({
          status: 500,
          message: 'Internal Server Error'
        });
      }
      fs.unlink(tmpFile, function (err) {
        if (err) {
          log.write(err);
        }
        log.write(new Date() + ' - RESIZE DONE: ' + options.imagefile);
        cb(null, config.cacheDirectory + cacheFile);
      });
    });

  }

}

module.exports = {
  'resize': resize,
};
