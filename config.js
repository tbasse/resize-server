'use strict';

var config = {
  appPort: 5060,
  appStdOut: true,
  convertCmd: 'convert',
  cacheDirectory: __dirname + '/cache/',
  cacheHeader: {
    maxAge: 315360000,
    expires: 1209600000
  }
};

module.exports = config;
