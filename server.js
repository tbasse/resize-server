'use strict';

var express         = require('express');
var log             = require('./lib/log');
var resizeApp       = require('./index');
var config          = require('./config');

var app = express();

app.use('/', resizeApp);

// now start the server
log.write('resize server listening on ' + config.appPort);
app.listen(config.appPort);
