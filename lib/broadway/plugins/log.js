/*
 * log.js: Default logging plugin which attachs winston to App instances 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var winston = require('winston'),
    common = require('../common'),
    constants = require('../constants');

var log = exports;

log.name    = 'log';
log.loggers = new winston.Container();

log.init = function (app, options, callback) {
  options = options || {};
  
  var logger;
  
  if (app.config) {
    //
    // Merge options with any pre-existing application config.
    //
    options = common.mixin({}, options, app.config.get('log') || {});
  }
  
  //
  // Hoist up relelvant logging functions onto the app
  // if requested.
  //
  if (options.extend !== false) {
    log.loggers.get('default', options).extend(app);
    app.loggers = log.loggers;
  }
  
  //
  // Listen to relevant `app` events and 
  // log them appropriately.
  //
  if (options.logAll) { 
    app.onAny(log.logEvent);
  }
  else {
    app.on(['log', '*'], log.logEvent);
    app.on(['log', '*', '*'], log.logEvent);
  }
  
  callback();
};

log.logEvent = function (msg, meta) {
  
};