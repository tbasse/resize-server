# A simple node.js image resize service

This repository is a modification of https://github.com/tbasse/resize-server that is published by me to npm in order to make the image resizing service an express module.

I thank the author of the original repository for making such a great service.

## Installation

```
npm i --save express-resize-img
```

## Using in express

```js
let resizeApp = require('express-resize-img'); 
let express = require('express');
let app = express();

// hook the resizing service to a path on your application
app.use('/resize', resizeApp);

// run
app.listen(12345); 
```

## Usage

http://serveraddress/`resize`/`output`/`url`

### Options

**`resize`**

- `width`x`height` stretch to dimensions
- c`width`x`height`[`gravity`] crop to dimensions with optional gravity  
  Default `gravity` is `c` for center  
  Choices include `c`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `nw`
- h`height`, h160: scale proportional to height
- w`width`, w120: scale proportional to width

**`output`**

- `format`  
  Default `format`is `jpg`
  Choices include `jgp` and `png`
- `jpg`,`quality`  
  Optional quality setting for `jpg` format (Defaults to 80)

**`url`**

- A valid URL to the source image to be resized

### Examples

`http://serveraddress/120x160/jpg/http://domain.com/image.jpg`  
`http://serveraddress/c300x300/jpg/http://domain.com/image.jpg`  
`http://serveraddress/c300x300n/jpg/http://domain.com/image.jpg`  
`http://serveraddress/h300/jpg/http://domain.com/image.jpg`  
`http://serveraddress/w300/jpg,100/http://domain.com/image.jpg`

## License

(MIT License)

Copyright (c) 2013 Thorsten Basse

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
