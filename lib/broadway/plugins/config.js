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

var config = module.exports;

config.init = function (app, options, callback) {
  options  = options  || {};
  callback = callback || function () { };
  
  app.config = new nconf.Provider(options);
  
  //
  // Remark: There should be code here for automated remote 
  // seeding and loading 
  //
  app.config.load(function (err) {
    return err ? callback(err) : callback(null, app);
  });
};