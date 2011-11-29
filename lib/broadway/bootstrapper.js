/*
 * bootstrapper.js: Default logic for bootstrapping broadway applications.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var broadway = require('../broadway');

//
// ### bootstrap (app, callback)
// #### @app {broadway.App} Application to bootstrap
// #### @callback {function} Continuation to respond to when complete.
// Bootstraps the specified `app`. 
//
exports.bootstrap = function (app, callback) {
  app.options['config']        = app.options['config'] || {};
  app.options['config'].init   = false;
  
  app.use(broadway.plugins.config);
  
  broadway.plugins.config.init.call(app, function (err) {
    if (err) {
      return callback(err);
    }
    
    app.use(broadway.plugins.exceptions);
    app.use(broadway.plugins.directories);
    app.use(broadway.plugins.log);
    callback();
  })
};