/*jshint expr:true*/
/*global describe, it*/
'use strict';

var RequestSplitter = require('../lib/requestSplitter.js');
var expect = require('chai').expect;

describe('RequestSplitter', function () {

  it('is a function', function () {
    expect(RequestSplitter).to.be.an.instanceOf(Function);
  });

  it('has a url property', function () {
    var rs = new RequestSplitter();
    expect(rs.url).to.exist;
  });

  it('has a query property', function () {
    var rs = new RequestSplitter();
    expect(rs.query).to.exist;
  });

  it('assigns first param to #url', function () {
    var rs = new RequestSplitter('first');
    expect(rs.url).to.equal('first');
  });

  it('assigns second param to #query', function () {
    var rs = new RequestSplitter('first', 'second');
    expect(rs.query).to.equal('second');
  });

  it('has a urlMatch property', function () {
    var rs = new RequestSplitter();
    expect(rs.urlMatch).to.exist;
  });

  describe('#urlMatch', function () {

    it('is a regular expression', function () {
      var rs = new RequestSplitter();
      expect(rs.urlMatch).to.be.instanceOf(RegExp);
    });

    it('matches "/c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg"',
      function () {
        var rs = new RequestSplitter();
        var url = '/c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg';
        var result = rs.urlMatch.test(url);
        expect(result).to.equal(true);
      }
    );

    it('treats leading slash as optional',
      function () {
        var rs = new RequestSplitter();
        var url = 'c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg';
        var result = rs.urlMatch.test(url);
        expect(result).to.equal(true);
      }
    );

  });

  it('has a mapOptions() method', function () {
    var rs = new RequestSplitter();
    expect(rs.mapOptions).to.be.an.instanceOf(Function);
  });

  describe('#mapOptions()', function () {

    it('returns an options map', function () {
      var url = 'c200x400n/jpg,75/http://trakt.us/images/posters/892.jpg';
      var query = {
        demo: 'asd asd'
      };
      var rs = new RequestSplitter(url, query);
      var options = rs.mapOptions();
      expect(options).to.exist;
      expect(options.action).to.equal('crop');
      expect(options.width).to.equal('200');
      expect(options.height).to.equal('400');
      expect(options.gravity).to.equal('n');
      expect(options.format).to.equal('jpg');
      expect(options.quality).to.equal(75);
      expect(options.imagefile).to.equal(
        'http://trakt.us/images/posters/892.jpg'
      );
      expect(options.url).to.equal(
        'http://trakt.us/images/posters/892.jpg?demo=asd%20asd'
      );
      expect(options.suffix).to.equal('.jpg');
    });

  });

});
