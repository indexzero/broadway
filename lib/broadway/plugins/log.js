/*
 * log.js: Default logging plugin which attachs winston to App instances 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var winston = require('winston'),
    constants = require('../constants');

var log = exports;

log.name    = 'log';
log.logger  = new winston.Logger();
log.loggers = new winston.Container();

log.init = function (app, options, callback) {
  //
  // Hoist up relelvant logging functions onto the app
  //
  if (options.extend !== false) {
    log.logger.extend(app);
    app.loggers = log.loggers;
  }
  
  //
  // Listen to relevant `app` events and 
  // log them appropriately.
  //
  if (options.logAll) { 
    app.onAny(log.logEvent) 
  }
  else {
    app.on(['log', '*'], log.logEvent);
  }
  
  callback();
};

log.logEvent = function (msg, meta) {
  
};