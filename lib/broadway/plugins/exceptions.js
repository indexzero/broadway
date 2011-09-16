/*
 * exceptions.js: Plugin responsible for logging all uncaughtExceptions in a flatiron App.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var winston = require('winston'),
    common = require('../common');

var exceptions = exports;

//
// Setup default state for the exceptions plugin
//
exceptions.name       = 'exceptions';
exceptions.initalized = false;

var defaultConfig = exceptions.defaultConfig = {
  console: {
    colorize: false,
    json: true,
    level: 'silly'
  }
};

exceptions.init = function (app, options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  callback = callback || function () { };
  options  = options  || {};
  
  if (app.config) {
    options = common.mixin({}, options, app.config.get('exceptions') || {});
  }
  
  if (exceptions.initalized) {
    return callback();
  }

  var exceptionHandlers = [];

  //
  // Create the exceptionHandlers defaulting to Console and Loggly.
  //
  exceptionHandlers.push(new winston.transports.Console(options.console || defaultConfig.console));
  
  Object.keys(options).forEach(function (name) {
    if (name === 'console') {
      return;
    }
    else if (name === 'loggly') {
      options.loggly.json = options.loggly.json !== false;
    }
    
    exceptionHandlers.push(new (winston.transports[common.capitalize(name)])(options[name]));
  });
  
  //
  // Update the state of the plugin with the logger.
  //
  exceptions.logger = new winston.Logger({ exceptionHandlers: exceptionHandlers });
  exceptions.initalized = true;
  
  //
  // Have the logger handle uncaught exceptions.
  //
  exceptions.logger.handleExceptions();
  callback();
};