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
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Prepopulates the directory structure of this application.
//
exports.init = function (app, options, done) {
  options = options || {};
  
  if (app.config) {
    //
    // Merge options with any pre-existing application config.
    //
    options = common.mixin({}, options, app.config.get('directories') || {});
  }
  
  options = common.directories.normalize(app.root, options);
  common.directories.create(options, function (err) {
    return err ? done(err) : done(null, app);
  });
};