/*
 * core.js: Core plugin exposing features in node.js
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var async = require('async');

//
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Initializes the `core` plugin which consists of `config`, `log`,
// `exceptions`, and `directories` in that order. 
//
exports.init = function (app, options, done) {
  async.forEach(['config', 'log', 'exceptions', 'directories'], function _init(plugin, next) {
    app.plugins[plugin] = app.plugins[plugin] || require('./' + plugin);
    app._attach(plugin, options[plugin] || app._options[plugin], next);
  }, done);
};