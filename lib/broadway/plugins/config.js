/*
 * config.js: Default configuration management plugin which attachs nconf to App instances 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var nconf = require('nconf');

//
// Remark: This should be removed (redis should not be a required depdendency).
//
require('nconf-redis');

//
// ### Name this plugin
//
exports.name = 'config';

//
// ### function init (options, done)
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends `this` (the application) with configuration functionality
// from `nconf`.
//
exports.init = function (options, done) {
  done    = done     || function () { };
  options = options  || {};
  
  this.config = new nconf.Provider(options);
  
  //
  // Remark: There should be code here for automated remote 
  // seeding and loading 
  //
  this.config.load(function (err) {
    return err ? done(err) : done();
  });
};