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
// ### function attach (options)
// #### @options {Object} Options for this plugin
// Initializes `this` (the application) with the `core` plugins consisting of:
// `config`, `log`, `exceptions`, and `directories` in that order. 
//
exports.attach = function (options) {
  var self = this;
  ['config', 'log', 'exceptions', 'directories'].forEach(function _attach (plugin) {
    self.use(require('./' + plugin), options[plugin] || self.options[plugin])
  });
};