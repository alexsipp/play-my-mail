// Copyright 2013. All Rights Reserved.
/**
 * @fileoverview
 * @author christopher.blakey@umsuic.com (Chris Blakey)
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , jade    = require('jade')
  , util    = require('util')
  , colors  = require('colors')
  , fs      = require('fs')
  , http    = require('http')
  , events  = require('events')
  , _       = require('underscore')
  , async   = require('async')
  , request = require('request')
  , redis   = require('redis')
  , PlayMy  = require('./lib/playmy')
  , versionator = require('versionator');

//http.globalAgent.maxSockets = 10000;
process.title = 'node play-my-mail app';

app = express();
app.set('version', '0.0.1');
app.set('configfilename', __dirname + '/config/config.json');
app.set('configfile', fs.readFileSync(app.get('configfilename')).toString());
app.set('config', JSON.parse(app.get('configfile')));

app.debug = function debug() {
  if(app.get('config').logging !== undefined && app.get('config').logging.enabled) {
    console.log.apply(null, arguments);
  }
};

// Name database
var app_config = app.get('config');
app.set('playmy', new PlayMy(app_config));
app.set('json spaces', 2);

// middleware
app.use(express.compress());
app.use(express.methodOverride());

// versioned paths for static assets to help browser caching
var basic = versionator.createBasic('v' + app.get('version'));

app.locals({
  versionPath: basic.versionPath,
  title: ''
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'xYud7Bid7Hj6'}));
app.use(basic.middleware);
app.use(express['static'](__dirname + '/public', { maxAge: 2592000000 }));
app.use(express.logger({ format: app.get('config').logging.format, immediate: false }));
app.use(app.router);

// error handling
process.addListener('uncaughtException', function(err, stack) {
  console.log('UncaughtException '.red);
  console.log(err.stack);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  console.log('Error (%s) %s %s'.red, err.status, err.msg, err.stack || '');
  res.send({ error: err.msg, stack: err.stack });
  return;
});

require('./routes');

app.listen(app.get('config').app.port);
app.debug('Listening on %d', app.get('config').app.port);

// Print out some useful info
console.log('---------------------------------------------------------');
console.log('Application Started'.green);
console.log('---------------------------------------------------------');
console.log('%s'.yellow, app.settings.env);
console.log('---------------------------------------------------------');
console.log('Server:      App listening on port %d', app.get('config').app.port);
console.log('Using:       Express %s', express.version);
console.log('---------------------------------------------------------');
