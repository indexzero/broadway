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

//
// ### Setup default state for the exceptions plugin
//
log.name   = 'log';
log.ignore = ['broadway'];

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends the application with loggin functionality from `winston`.
//
log.init = function (app, options, done) {
  options = options || {};
    
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
  app.log = new winston.Container(options);
  app.log.namespaces = options.namespaces || {};
  app.log.get('default').extend(app.log);
  
  Object.keys(app.log.namespaces).forEach(function (namespace) {
    app.log.add(namespace);
  });
  
  //
  // Listen to relevant `app` events and 
  // log them appropriately.
  //
  if (options.logAll) {
    app.logAll = true;
    app.onAny(log.logEvent);
  }
  else {
    app.logAll = false;
    app.on(['log', '*'], log.logEvent);
    app.on(['log', '*', '*'], log.logEvent);
  }
  
  done(null, app);
};

//
// ### function logEvent (msg, meta) 
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Metadata to log
// Logs the specified `msg` and `meta` according to 
// the following conditions:
//
// 1. `log::[level]` - Logs to the default logger
// 2. `log::[namespace]::[level]` - Logs to a namespaced logger
// 3. `[namespace]::[level|message]` - If `app.logAll` is set,
//    then we will attempt to find a logger at `namespace`, 
//    otherwise the default logger is used. If the second part
//    of the event is a level then that level is used and the
//    rest will be the message.   
// 
//
log.logEvent = function (msg, meta) {
  var parts = this.event.split(this.delimiter),
      ev = parts[0],
      namespace,
      logger,
      level;
      
  if (log.ignore.indexOf(ev) !== -1) {
    return;
  }
  
  if (ev === 'log') {
    if (parts.length === 2) {
      namespace = 'default';
      level = parts[1];
    }
    else {
      namespace = parts[1];
      level = parts[2];
    }    
  }
  else if (this.logAll) {
    namespace = this.log.namespaces[ev] ? ev : 'default';
    level = parts[1];
    
    if (!meta && typeof msg === 'object') {
      meta = msg;
      msg = '';
    }
    
    if (parts.length > 2) {
      msg = parts.slice(2).join(this.delimiter) + this.delimiter + msg;
    }
  }
  
  return log._log.call(this, namespace, level, msg, meta);
};

//
// ### @private function _log (namespace, level, msg, meta)
// #### @namespace {string} Namespace of the logger to use
// #### @level {string} Log level of the message.
// #### @msg {string} Message to log.
// #### @meta {Object} Metadata to log.
// Logs `msg` and `meta` to a logger at `namespace` at
// the specified `level`.
//
log._log = function (namespace, level, msg, meta) {
  var logger = this.log.get(namespace);
  
  if (!logger[level]) {
    level = 'info';
  }
  
  logger[level](msg, meta);
  this.emit(['broadway', 'logged'], level, msg, meta);
};