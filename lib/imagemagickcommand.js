'use strict';

function ImageMagickCommand(options, files, convertCmd) {
  options = options || {};

  if (options.action === 'crop') {
    return new CropImageMagickCommand(
      options,
      files,
      convertCmd
    );
  } else if (options.width && options.height) {
    return new ScaleImageMagickCommand(
      options,
      files,
      convertCmd
    );
  } else {
    return new ResizeImageMagickCommand(
      options,
      files,
      convertCmd
    );
  }
}


function AbstractImageMagickCommand(options, files, convertCmd) {
  this.options = options;
  this.files = files;
  this.convertCmd = convertCmd || 'convert';

  this.gravityName = {
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
}

AbstractImageMagickCommand.prototype.buildCommandString = function () {
  var imCommand;

  imCommand = [
    this.convertCmd,
    this.files.tmp,
    this.buildActionString(),
    '+repage',
    '-quality ' + this.options.quality,
    '-format ' + this.options.format,
    '-background white',
    '-flatten',
    this.files.cache
  ];

  return imCommand.join(' ');
};

AbstractImageMagickCommand.prototype.buildActionString = function () {
  return '';
};

AbstractImageMagickCommand.prototype.buildDimensionString = function () {
  return this.options.width + 'x' + this.options.height;
};


function ResizeImageMagickCommand(options, files, convertCmd) {
  AbstractImageMagickCommand.call(this, options, files, convertCmd);
}

ResizeImageMagickCommand.prototype = new AbstractImageMagickCommand();

ResizeImageMagickCommand.prototype.buildActionString = function () {
  return '-resize "' + this.buildDimensionString() + '"';
};


function ScaleImageMagickCommand(options, files, convertCmd) {
  AbstractImageMagickCommand.call(this, options, files, convertCmd);
}

ScaleImageMagickCommand.prototype = new AbstractImageMagickCommand();

ScaleImageMagickCommand.prototype.buildActionString = function () {
  return '-scale "' + this.buildDimensionString() + '!"';
};


function CropImageMagickCommand(options, files, convertCmd) {
  AbstractImageMagickCommand.call(this, options, files, convertCmd);
}

CropImageMagickCommand.prototype = new AbstractImageMagickCommand();

CropImageMagickCommand.prototype.buildActionString = function () {
  return [
    '-thumbnail "' + this.buildDimensionString() + '^>"',
    '-gravity ' + this.gravityName[this.options.gravity],
    '-crop "' + this.buildDimensionString() + '+0+0"',
  ].join(' ');
};

module.exports = ImageMagickCommand;
