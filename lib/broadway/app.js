/*
 * app.js: Core Application object for managing plugins and features in broadway
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var util = require('util'),
    async = require('async'),
    events = require('eventemitter2'),
    common = require('./common'),
    constants = require('./constants'),
    features = require('./features');

var App = exports.App = function (options) {
  //
  // Setup options and `App` constants.
  //
  var self       = this;
  options        = options || {};
  this.root      = options.root;
  this.delimiter = options.delimiter || constants.DELIMITER; 

  //
  // Inherit from `EventEmitter2`
  //
  events.EventEmitter2.call(this, { 
    delimiter: this.DELIMITER, 
    wildcard: true
  });
  
  //
  // Setup other relevant options such as the plugins 
  // for this instance.
  //
  this.initialized  = {};
  this.options      = options;
  this.plugins      = options.plugins   || {};
  this.plugins.core = this.plugins.core || require('./plugins/core');
};

//
// Inherit from `EventEmitter2`.
//
util.inherits(App, events.EventEmitter2);

//
// ### function init (options, callback)
// #### @options {Object} **Optional** Options to initialize this instance with
// #### @callback {function} Continuation to respond to when complete.
// Initializes this instance by the following procedure:
//
// 1. Initializes all plugins (starting with `core`).
// 2. Creates all directories in `this.config.directories` (if any).
// 3. Ensures the files in the core directory structure conform to the 
//    features required by this application.
//
App.prototype.init = function (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }
  
  var self = this;
  
  function onComplete() {
    self.initialized['all'] = true;
    callback();
  }
  
  function ensureFeatures (err) {
    return err 
      ? onError(err)
      : features.ensure(this, onComplete);
  }
    
  function initOptions(plugin, next) {
    self.attach(plugin, options[plugin] || self.options[plugin], next);
  }
  
  //
  // Emit and respond with any errors that may short
  // circuit the process. 
  //
  function onError(err) {
    self.emit('error:init', err);
    callback(err);
  }
  
  //
  // Initialize plugins, then create directories and 
  // ensure features for this instance.
  //
  this.attach('core', this.options, function (err) {
    if (err) {
      return onError(err);
    }
    
    async.forEach(Object.keys(self.plugins).filter(function (p) { 
      return p !== 'core'; 
    }), initOptions, ensureFeatures);
  });
};

//
// ### function _attach(name, options, callback)
// Attachs the plugin with the specific name to this `App` instance.
//
App.prototype.attach = function (name, options, callback) {
  var self = this;
  
  this.plugins[name].init.call(this, options, function (err) {
    if (err) {
      return callback(err);
    }
    
    self.initialized[name] = true;
    callback();
  });
}


App.prototype.use = function (plugin, options) {
  var name = plugin.name;
  if (this.plugins[name] && this.plugins[name].detach) {
    this.plugins[name].detach(this);
  }
  
  this.plugins[name]     = plugin;
  this.options[name]     = options;
  this.initialized[name] = false;
};

//
// ### function inspect ()
// Inspects the modules and features used by the current 
// application directory structure
//
App.prototype.inspect = function () {
  
};