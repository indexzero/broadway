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
// ### function attach (options)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Prepopulates the directory structure of `this` (the application).
//
exports.attach = function (options) {
  options = options || {};
  
  if (this.config) {
    //
    // Merge options with any pre-existing application config.
    //
    options = common.mixin({}, options, this.config.get('directories') || {});
    this.config.set('directories', options);
  }
  
  options = common.directories.normalize(this.root, options);
  
  //
  // Add a named initializer to the application with the 
  // specified `options` to create the directories later.
  //
  this.initializers['directories'] = function (done) {
    common.directories.create(options, function (err) {
      return err ? done(err) : done();
    });
  };
};