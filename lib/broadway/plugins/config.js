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

//
// Sample usage:
//
// new broadway.App({
//   config: {
//     host: 'some-redis-server',
//     port: 'some-redis-port',
//     auth: 'some-redis-auth',
//     files: ['file1', 'file2'],
//     useArgv: true   // default value
//     useEnv:  true   // default value
//   }
// })
//

config.init = function (app, options, callback) {
  options  = options  || {};
  callback = callback || function () { };
  
  app.config = new nconf.Provider();
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
  callback(null, app);
};