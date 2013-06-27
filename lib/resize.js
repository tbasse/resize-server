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


function resize(options, cb) {

  var cacheFileName,
      cacheFilePath,
      tmpFileName,
      tmpFilePath;

  if (! url.parse(options.url).hostname) {
    // if remote url hast no hostname end with status 400
    return cb({status: 400, url: options.url});
  }

  cacheFileName = generateCacheFilename(options);
  tmpFileName   = cacheFileName + '_tmp' + options.suffix;
  cacheFilePath = config.cacheDirectory + cacheFileName;
  tmpFilePath   = config.tmpDirectory + tmpFileName;

  var execCmd = new ImageMagickCommand(
    options,
    {
      tmp: tmpFilePath,
      cache: cacheFilePath
    },
    config.convertCmd
  ).buildCommandString();

  fs.exists(config.cacheDirectory + cacheFileName, function (exists) {
    if (exists) {
      log.write(new Date() + ' - CACHE HIT: ' + options.url);
      return cb(null, config.cacheDirectory + cacheFileName);
    }
    log.write(new Date() + ' - RESIZE STARTED: ' + options.url);
    downloadRemoteImage();
  });

  function downloadRemoteImage() {
    var fsStream = fs.createWriteStream(tmpFilePath);

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

    var execParam = {
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
      fs.unlink(tmpFilePath, function (err) {
        if (err) {
          log.write(err);
        }
        log.write(new Date() + ' - RESIZE DONE: ' + options.imagefile);
        cb(null, cacheFilePath);
      });
    });

  }

}

module.exports = {
  'resize': resize
};
