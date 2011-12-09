/*
 * app.js: Core Application object for managing plugins and features in broadway
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var utile = require('utile'),
    async = utile.async,
    events = require('eventemitter2'),
    bootstrapper = require('./bootstrapper'),
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
    delimiter: this.delimiter, 
    wildcard: true
  });
  
  //
  // Setup other relevant options such as the plugins 
  // for this instance.
  //
  this.options      = options;
  this.env          = options.env || process.env['NODE_ENV'] || 'development'
  this.plugins      = options.plugins || {};
  this.initialized  = false;
  this.bootstrapper = options.bootstrapper || bootstrapper;
  this.initializers = {};
  
  //
  // Bootstrap this instance
  //
  this.bootstrapper.bootstrap(this);
};

//
// Inherit from `EventEmitter2`.
//
utile.inherits(App, events.EventEmitter2);

//
// ### function init (options, callback)
// #### @options {Object} **Optional** Additional options to initialize with.
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
  
  if (this.initialized) {
    return callback();
  }
    
  var self = this;
  options = options   || {};
  callback = callback || function () {};
  this.env = options.env || this.env;
  this.options = common.mixin({}, this.options, options);
  
  function onComplete() {
    self.initialized = true;
    self.emit('init');
    callback();
  }
  
  function ensureFeatures (err) {
    return err 
      ? onError(err)
      : features.ensure(this, onComplete);
  }
    
  function initPlugin(plugin, next) {
    if (typeof self.initializers[plugin] === 'function') {
      return self.initializers[plugin].call(self, function (err) {
        if (err) {
          return next(err);
        }
        
        self.emit(['plugin', plugin, 'init']);
        self.initializers[plugin] = true;
        next();
      });
    }
    
    next();
  }
  
  function initPlugins() {
    async.forEach(Object.keys(self.initializers), initPlugin, ensureFeatures);
  }
  
  //
  // Emit and respond with any errors that may short
  // circuit the process. 
  //
  function onError(err) {
    self.emit(['error', 'init'], err);
    callback(err);
  }
  
  //
  // Run the bootstrapper, initialize plugins, and 
  // ensure features for this instance.
  //
  this.bootstrapper.init(this, initPlugins);
};

//
// ### function use(plugin, callback)
// Attachs the plugin with the specific name to this `App` instance.
//
App.prototype.use = function (plugin, options, callback) {
  options = options || {};

  var name = plugin.name,
      self = this;
      
  if (this.plugins[name] && this.plugins[name].detach) {
    this.plugins[name].detach(this);
  }
  
  //
  // Setup state on this instance for the specified plugin
  //
  this.plugins[name] = plugin;
  this.options[name] = common.mixin({}, options, this.options[name] || {});
  
  //
  // Attach the specified plugin to this instance, extending 
  // the `App` with new functionality.
  //
  if (this.plugins[name].attach && options.attach !== false) {
    this.plugins[name].attach.call(this, options);  
  }
  
  //
  // Setup the initializer only if `options.init` is 
  // not false. This allows for some plugins to be lazy-loaded
  //
  if (options.init === false) {
    return; 
  } 
  
  if (!this.initialized) {
    this.initializers[name] = plugin.init || true;
  }
  else if (plugin.init) {
    plugin.init.call(this, function (err) {
      var args = err 
        ? [['plugin', name, 'error'], err]
        : [['plugin', name, 'init']];
      
      self.emit.apply(self, args);
      if (callback) {
        return err ? callback(err) : callback();
      }
    });
  }
};

//
// ### function inspect ()
// Inspects the modules and features used by the current 
// application directory structure
//
App.prototype.inspect = function () {
  
};