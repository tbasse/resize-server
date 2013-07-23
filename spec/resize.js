/*global describe, it*/
'use strict';

var ResizeJob = require('../lib/resize.js').ResizeJob;
var crypto    = require('crypto');
var expect    = require('chai').expect;

describe('ResizeJob', function () {

  it('is a function', function () {
    expect(ResizeJob).to.be.an.instanceOf(Function);
  });

  it('has a method generateCacheFilename', function () {
    var rj = new ResizeJob();
    expect(rj.generateCacheFilename).to.be.an.instanceOf(Function);
  });

  it('has a method isAlreadyCached', function () {
    var rj = new ResizeJob();
    expect(rj.isAlreadyCached).to.be.an.instanceOf(Function);
  });

  it('has a method validateRemoteSource', function () {
    var rj = new ResizeJob();
    expect(rj.validateRemoteSource).to.be.an.instanceOf(Function);
  });

  describe('generateCacheFilename()', function () {

    it('returns a string', function () {
      var options = {
        imagefile: 'teststring',
        suffix: '.jpg'
      };
      var rj = new ResizeJob(options);
      expect(rj.generateCacheFilename()).to.be.a('string');
    });

    it('returns correct shasum of options + suffix', function () {
      var options = {
        imagefile: 'teststring',
        format: 'png',
        suffix: '.jpg'
      };
      var rj = new ResizeJob(options);
      var shasum = crypto.createHash('sha1');
      shasum.update(JSON.stringify(options));
      var cache = shasum.digest('hex') + '.' + options.format;
      expect(rj.generateCacheFilename()).to.equal(cache);
    });

  });

  it('has a method downloadRemoteImage', function () {
    var rj = new ResizeJob();
    expect(rj.downloadRemoteImage).to.be.an.instanceOf(Function);
  });

  it('has a method convertImage', function () {
    var rj = new ResizeJob();
    expect(rj.convertImage).to.be.an.instanceOf(Function);
  });

  describe('isAlreadyCached()', function () {

    it('returns a boolean', function (done) {
      var options = {
        imagefile: 'teststring',
        suffix: '.jpg'
      };
      var filename = 'resize.js';
      var rj = new ResizeJob(options);
      rj.isAlreadyCached(filename, function (result) {
        if (typeof result === 'boolean') {
          done();
        } else {
          throw new Error('returned ' + typeof result);
        }
      });
    });

    it('returns false if file does not exists', function (done) {
      var options = {
        imagefile: 'teststring',
        suffix: '.jpg'
      };
      var filename = 'xxx.yy';
      var rj = new ResizeJob(options);
      rj.isAlreadyCached(filename, function (result) {
        if (! result) {
          done();
        } else {
          throw new Error('returned ' + result);
        }
      });
    });

    it('returns true if file does exists', function (done) {
      var options = {
        imagefile: 'teststring',
        suffix: '.jpg'
      };
      var filename = __filename;
      var rj = new ResizeJob(options);
      rj.isAlreadyCached(filename, function (result) {
        if (result) {
          done();
        } else {
          throw new Error('returned ' + result);
        }
      });
    });

  });

  describe('validateRemoteSource()', function () {

    it('returns a boolean', function () {
      var options = {
        url: ''
      };
      var rj = new ResizeJob(options, function () {});
      expect(rj.validateRemoteSource()).to.be.a('boolean');
    });

    it('returns false on invalid #options.url', function () {
      var options = {
        url: 'domain.com/path/image.jog'
      };
      var rj = new ResizeJob(options, function () {});
      expect(rj.validateRemoteSource()).to.equal(false);
    });

    it('returns true on valid #options.url', function () {
      var options = {
        url: 'http://domain.com/path/image.jog'
      };
      var rj = new ResizeJob(options, function () {});
      expect(rj.validateRemoteSource()).to.equal(true);
    });

  });

});
