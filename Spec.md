# TOC
   - [ImageMagickCommand](#imagemagickcommand)
     - [#files](#imagemagickcommand-files)
     - [buildDimensionString()](#imagemagickcommand-builddimensionstring)
     - [buildActionString()](#imagemagickcommand-buildactionstring)
     - [buildCommandString()](#imagemagickcommand-buildcommandstring)
   - [RequestSplitter](#requestsplitter)
     - [#urlMatch](#requestsplitter-urlmatch)
     - [#mapOptions()](#requestsplitter-mapoptions)
   - [ResizeJob](#resizejob)
     - [generateCacheFilename()](#resizejob-generatecachefilename)
     - [isAlreadyCached()](#resizejob-isalreadycached)
     - [validateRemoteSource()](#resizejob-validateremotesource)
<a name=""></a>
 
<a name="imagemagickcommand"></a>
# ImageMagickCommand
is a function.

```js
expect(ImageMagickCommand).to.be.an.instanceOf(Function);
```

assigns first param to #options.

```js
var im = new ImageMagickCommand('first');
expect(im.options).to.equal('first');
```

assigns second param to #files.

```js
var im = new ImageMagickCommand('first', 'second');
expect(im.files).to.equal('second');
```

assigns third param to #convertCmd.

```js
var im = new ImageMagickCommand(
  'first',
  'second',
  'convertCmd'
);
expect(im.convertCmd).to.equal('convertCmd');
```

assigns "convert" to #convertCmd if third param is missing .

```js
var im = new ImageMagickCommand(
  'first',
  'second'
  );
expect(im.convertCmd).to.equal('convert');
```

has a property gravityName.

```js
var im = new ImageMagickCommand();
expect(im.gravityName).to.exist;
```

has a method buildDimensionString.

```js
var im = new ImageMagickCommand();
expect(im.buildDimensionString).to.be.an.instanceOf(Function);
```

has a method buildActionString.

```js
var im = new ImageMagickCommand();
expect(im.buildActionString).to.be.an.instanceOf(Function);
```

has a method buildCommandString.

```js
var im = new ImageMagickCommand();
expect(im.buildCommandString).to.be.an.instanceOf(Function);
```

<a name="imagemagickcommand-files"></a>
## #files
has properties tmp and cache.

```js
var files = {
  tmp: 'tmp',
  cache: 'cache'
};
var im = new ImageMagickCommand('first', files);
expect(im.files.tmp).to.equal('tmp');
expect(im.files.cache).to.equal('cache');
```

<a name="imagemagickcommand-builddimensionstring"></a>
## buildDimensionString()
returns a dimension string "200x400".

```js
var options = {
  width: '200',
  height: '400'
};
var im = new ImageMagickCommand(options, 'second');
expect(im.buildDimensionString()).to.equal('200x400');
```

<a name="imagemagickcommand-buildactionstring"></a>
## buildActionString()
returns a string.

```js
var im = new ImageMagickCommand('first', 'second');
expect(im.buildActionString()).to.be.a('string');
```

<a name="imagemagickcommand-buildcommandstring"></a>
## buildCommandString()
returns a string.

```js
var im = new ImageMagickCommand(
  'first',
  'second'
);
expect(im.buildCommandString()).to.be.a('string');
```

<a name="requestsplitter"></a>
# RequestSplitter
is a function.

```js
expect(RequestSplitter).to.be.an.instanceOf(Function);
```

has a url property.

```js
var rs = new RequestSplitter();
expect(rs.url).to.exist;
```

has a query property.

```js
var rs = new RequestSplitter();
expect(rs.query).to.exist;
```

assigns first param to #url.

```js
var rs = new RequestSplitter('first');
expect(rs.url).to.equal('first');
```

assigns second param to #query.

```js
var rs = new RequestSplitter('first', 'second');
expect(rs.query).to.equal('second');
```

has a urlMatch property.

```js
var rs = new RequestSplitter();
expect(rs.urlMatch).to.exist;
```

has a mapOptions() method.

```js
var rs = new RequestSplitter();
expect(rs.mapOptions).to.be.an.instanceOf(Function);
```

<a name="requestsplitter-urlmatch"></a>
## #urlMatch
is a regular expression.

```js
var rs = new RequestSplitter();
expect(rs.urlMatch).to.be.instanceOf(RegExp);
```

matches "/c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg".

```js
var rs = new RequestSplitter();
var url = '/c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg';
var result = rs.urlMatch.test(url);
expect(result).to.equal(true);
```

treats leading slash as optional.

```js
var rs = new RequestSplitter();
var url = 'c200x200n/jpg,75/http://trakt.us/images/posters/892.jpg';
var result = rs.urlMatch.test(url);
expect(result).to.equal(true);
```

<a name="requestsplitter-mapoptions"></a>
## #mapOptions()
returns an options map.

```js
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
expect(options.quality).to.equal('75');
expect(options.imagefile).to.equal(
  'http://trakt.us/images/posters/892.jpg'
);
expect(options.url).to.equal(
  'http://trakt.us/images/posters/892.jpg?demo=asd%20asd'
);
expect(options.suffix).to.equal('.jpg');
```

<a name="resizejob"></a>
# ResizeJob
is a function.

```js
expect(ResizeJob).to.be.an.instanceOf(Function);
```

has a method generateCacheFilename.

```js
var rj = new ResizeJob();
expect(rj.generateCacheFilename).to.be.an.instanceOf(Function);
```

has a method isAlreadyCached.

```js
var rj = new ResizeJob();
expect(rj.isAlreadyCached).to.be.an.instanceOf(Function);
```

has a method validateRemoteSource.

```js
var rj = new ResizeJob();
expect(rj.validateRemoteSource).to.be.an.instanceOf(Function);
```

has a method downloadRemoteImage.

```js
var rj = new ResizeJob();
expect(rj.downloadRemoteImage).to.be.an.instanceOf(Function);
```

has a method convertImage.

```js
var rj = new ResizeJob();
expect(rj.convertImage).to.be.an.instanceOf(Function);
```

<a name="resizejob-generatecachefilename"></a>
## generateCacheFilename()
returns a string.

```js
var options = {
  imagefile: 'teststring',
  suffix: '.jpg'
};
var rj = new ResizeJob(options);
expect(rj.generateCacheFilename()).to.be.a('string');
```

returns correct shasum of options + suffix.

```js
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
```

<a name="resizejob-isalreadycached"></a>
## isAlreadyCached()
returns a boolean.

```js
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
```

returns false if file does not exists.

```js
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
```

returns true if file does exists.

```js
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
```

<a name="resizejob-validateremotesource"></a>
## validateRemoteSource()
returns a boolean.

```js
var options = {
  url: ''
};
var rj = new ResizeJob(options, function () {});
expect(rj.validateRemoteSource()).to.be.a('boolean');
```

returns false on invalid #options.url.

```js
var options = {
  url: 'domain.com/path/image.jog'
};
var rj = new ResizeJob(options, function () {});
expect(rj.validateRemoteSource()).to.equal(false);
```

returns true on valid #options.url.

```js
var options = {
  url: 'http://domain.com/path/image.jog'
};
var rj = new ResizeJob(options, function () {});
expect(rj.validateRemoteSource()).to.equal(true);
```

