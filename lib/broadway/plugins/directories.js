/*
 * directories.js: Plugin for creating directories for a required for a broadway App.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var common = require('../common');

//
// ### Name this plugin
//
exports.name = 'directories';

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Prepopulates the directory structure of `this` (the application).
//
exports.init = function (options, done) {
  options = options || {};
  
  if (this.config) {
    //
    // Merge options with any pre-existing application config.
    //
    options = common.mixin({}, options, this.config.get('directories') || {});
  }
  
  options = common.directories.normalize(this.root, options);
  common.directories.create(options, function (err) {
    return err ? done(err) : done();
  });
};