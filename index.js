var createServers = require('create-servers'),
    mixin = require('merge-descriptors'),
    Understudy = require('understudy');

var App = module.exports = function App(base, options) {
  Understudy.call(this);

  if (!options) {
    options = base;
    base = null;
  }

  if (base) {
    mixin(this, base, false);
  }
};

App.prototype.preboot = function (fn) {
  this.before('start', fn);
};

App.prototype.start = function (options, callback) {
  var self = this;
  this.perform('start', this, options, function (next) {
    self._listen(options, next);
  }, callback);
};

App.prototype._listen = function (options, callback) {
  var self = this;
  createServers({
    http: options.http,
    https: options.https,
    //
    // Remark: is not doing a `bind` a performance optimization
    // from express?
    //
    // https://github.com/strongloop/express/blob/master/lib/express.js#L28
    //
    handler: this.handle.bind(this)
  }, function (err, servers) {
    if (err) { return callback(err) }
    self.servers = servers;
    callback();
  });
};

App.prototype.close = function (callback) {
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

  servers.forEach(function (key) {
    self.servers[key].close(onClosed);
  });
};