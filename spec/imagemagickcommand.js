/*global describe, it*/
'use strict';

var ImageMagickCommand = require('../lib/imagemagickcommand.js');

var expect = require('chai').expect;

describe('ImageMagickCommand', function () {

  it('is a function', function () {
    expect(ImageMagickCommand).to.be.an.instanceOf(Function);
  });

  it('assigns first param to #options', function () {
    var im = new ImageMagickCommand('first');
    expect(im.options).to.equal('first');
  });

  it('assigns second param to #files', function () {
    var im = new ImageMagickCommand('first', 'second');
    expect(im.files).to.equal('second');
  });

  describe('#files', function () {

    it('has properties tmp and cache', function () {
      var files = {
        tmp: 'tmp',
        cache: 'cache'
      };
      var im = new ImageMagickCommand('first', files);
      expect(im.files.tmp).to.equal('tmp');
      expect(im.files.cache).to.equal('cache');
    });

  });

  it('assigns third param to #convertCmd', function () {
    var im = new ImageMagickCommand(
      'first',
      'second',
      'convertCmd'
    );
    expect(im.convertCmd).to.equal('convertCmd');
  });

  it('assigns "convert" to #convertCmd if third param is missing ',
    function () {
      var im = new ImageMagickCommand(
        'first',
        'second'
        );
      expect(im.convertCmd).to.equal('convert');
    }
  );

  it('has a property gravityName', function () {
    var im = new ImageMagickCommand();
    expect(im.gravityName).to.exist;
  });

  it('has a method buildDimensionString', function () {
    var im = new ImageMagickCommand();
    expect(im.buildDimensionString).to.be.an.instanceOf(Function);
  });

  describe('buildDimensionString()', function () {

    it('returns a dimension string "200x400"', function () {
      var options = {
        width: '200',
        height: '400'
      };
      var im = new ImageMagickCommand(options, 'second');
      expect(im.buildDimensionString()).to.equal('200x400');
    });

  });

  it('has a method buildActionString', function () {
    var im = new ImageMagickCommand();
    expect(im.buildActionString).to.be.an.instanceOf(Function);
  });

  describe('buildActionString()', function () {

    it('returns a string', function () {
      var im = new ImageMagickCommand('first', 'second');
      expect(im.buildActionString()).to.be.a('string');
    });

  });

  it('has a method buildCommandString', function () {
    var im = new ImageMagickCommand();
    expect(im.buildCommandString).to.be.an.instanceOf(Function);
  });

  describe('buildCommandString()', function () {

    it('returns a string', function () {
      var im = new ImageMagickCommand(
        'first',
        'second'
      );
      expect(im.buildCommandString()).to.be.a('string');
    });

  });

});
