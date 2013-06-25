/*global describe, it*/
'use strict';

var helper = require('../lib/helper.js');
var expect = require('chai').expect;

describe('helper.getFileSuffix()', function () {

  it('is a function', function () {
    expect(helper.getFileSuffix).to.be.an.instanceOf(Function);
  });

  it('returns empty string when called without arguments', function () {
    expect(helper.getFileSuffix()).to.equal('');
  });

  it('returns correct suffix on one dot filenames', function () {
    var str = 'this_is_a.jpg';
    expect(helper.getFileSuffix(str)).to.equal('jpg');
  });

  it('returns correct suffix on multiple dot filenames', function () {
    var str = 'this_is_a.jpg.png';
    expect(helper.getFileSuffix(str)).to.equal('png');
  });

  it('returns no suffix on none dot filenames', function () {
    var str = 'this_has_no_suffix';
    expect(helper.getFileSuffix(str)).to.equal('');
  });

});
