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
// ### function (app, options, done)
// #### @app {broadway.App} Application to extend
// #### @options {Object} Options for this plugin
// #### @done {function} Continuation to respond to when complete.
// Extends the application with configuration functionality
// from `nconf`.
//
exports.init = function (app, options, done) {
  done    = done     || function () { };
  options = options  || {};
  
  app.config = new nconf.Provider(options);
  
  //
  // Remark: There should be code here for automated remote 
  // seeding and loading 
  //
  app.config.load(function (err) {
    return err ? done(err) : done(null, app);
  });
};