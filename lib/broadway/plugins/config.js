/*
 * config.js: Default configuration management plugin which attachs nconf to App instances 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var nconf = require('nconf');

var config = module.exports;

var reserved = ['store'];

config.init = function (app, options, callback) {
  callback = callback || function () { };
  
  app.config = Object.create(nconf.Provider);
  app.config.use(options.store || 'memory');
  
  Object.keys(options).forEach(function (key) {
    if (reserved.indexOf(key) === -1) {
      app.config.set(key, options[key]);
    }
  });
  
  //
  // Remark: There should be code here for automated remote 
  // seeding and loading 
  //
  callback();
};