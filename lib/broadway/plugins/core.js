/*
 * core.js: Core plugin exposing features in node.js
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var async = require('async');

//
// ### Name this plugin
//
exports.name = 'core';

//
// ### function (app, options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Initializes `this` (the application) with the `core` plugins consisting of:
// `config`, `log`, `exceptions`, and `directories` in that order. 
//
exports.init = function (options, done) {
  var self = this;
  
  async.forEach(['config', 'log', 'exceptions', 'directories'], function _init(plugin, next) {
    self.plugins[plugin] = self.plugins[plugin] || require('./' + plugin);
    self.attach(plugin, options[plugin] || self.options[plugin], next);
  }, done);
};