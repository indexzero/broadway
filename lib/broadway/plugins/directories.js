/*
 * directories.js: Plugin for creating directories for a required for a broadway App.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var common = require('../common');

exports.init = function (app, options, callback) {
  options = options || {};
  
  if (app.config) {
    //
    // Merge options with any pre-existing application config.
    //
    options = common.mixin({}, options, app.config.get('directories') || {});
  }
  
  options = common.directories.normalize(app.root, options);
  common.directories.create(options, callback);
};