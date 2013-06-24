'use strict';

function getFileSuffix(filename) {
  var result = '';
  if (filename.lastIndexOf('.') > 0) {
    result = filename.substr(filename.lastIndexOf('.') + 1) || '';
  }
  return result;
}

module.exports = {
  'getFileSuffix': getFileSuffix,
};
