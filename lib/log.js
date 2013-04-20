'use strict';

var config  = require('../config');

function log(str) {
  if (config.appStdOut) {
    console.log(str);
  }
}

module.exports = {
  'write': log
};
