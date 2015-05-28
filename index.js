'use strict';

var createServers = require('create-servers'),
    mixin = require('merge-descriptors'),
    Understudy = require('understudy');

/*
 * function App(options?, [base])
 * Creates a new App instance with the `options` supplied;
 * will optionally mixin any properties on the `base` onto
 * this instance.
 *
 */
var App = module.exports = function App(options, base) {
  Understudy.call(this);
  this.options = options || {};

  if (base) {
    this.mixin(base);
  }

  //
  // This is a simple internal shim for other config loaders
  //
  var self = this;
  this.config = {
    get: function (key) {
      return self.options[key];
    }
  };
};

/*
 * function preboot(fn)
 * Adds the "start middleware" to this instance.
 */
App.prototype.preboot = function preboot(fn) {
  this.before('start', fn);
};

/*
 * function mixin (ext, redine)
 * Mixes in any properties in `ext`. If `redefine` is
 * set to true, any properties on `ext` already existing
 * on this instance will be redefined.
 */
App.prototype.mixin = function mixin_(ext, redefine) {
  mixin(this, ext, redefine || false);
};

/*
 * function start ([options], callback)
 * Attempts to listen on HTTP(S) servers after
 * executing all "start middlewares" defined by
 *
 *     app.preboot(function initFn(app, options, next) {
 *       // Do startup things here.
 *       next();
 *     });
 */
App.prototype.start = function start(options, callback) {
  var self = this;
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  mixin(this.options, options, true);

  this.perform('setup', this, this.options, function (done) {
    this.perform('start', this, this.options, this._listen, done);
  }, callback);
};

/*
 * function close (callback)
 * Closes all HTTP(S) servers on the App,
 * if they are defined.
 */
App.prototype.close = function close(callback) {
  if (!this.servers) {
    return callback(new Error('No servers to close.'));
  }

  var servers = Object.keys(this.servers),
      closed = 0,
      self = this;

  /*
   * Invokes the callback once all the servers have
   * closed.
   */
  function onClosed() {
    if (++closed === servers.length) {
      callback();
    }
  }

  servers.forEach(function closeServer(key) {
    self.servers[key].close(onClosed);
  });
};

/*
 * function _listen (callback)
 * Starts up an HTTP and/or HTTPS server depending
 * on the respective options on this instance.
 */
App.prototype._listen = function _listen(callback) {
  var self = this;
  if (typeof this.handle !== 'function') {
    return callback(new Error('A handle function must be defined.'));
  }

  createServers({
    http: this.config.get('http'),
    https: this.config.get('https'),
    //
    // Remark: is not doing a `bind` a performance optimization
    // from express?
    //
    // https://github.com/strongloop/express/blob/master/lib/express.js#L28
    //
    handler: this.handle.bind(this)
  }, function onListen(err, servers) {
    if (err) { return callback(err); }
    self.servers = servers;
    callback();
  });
};
