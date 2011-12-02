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
exports.bootstrap = function (app) {
  app.options['config']        = app.options['config'] || {};
<<<<<<< HEAD
  // app.options['config'].init   = false;
=======
<<<<<<< HEAD
  // app.options['config'].init   = false;
=======
  app.options['config'].init   = false;
>>>>>>> 81c07b2b0f0763e38344fa511ff82854cc107aff
>>>>>>> 888ca34b22e1cd86865fa95e9f99830be8b740fe
  app.use(broadway.plugins.config, app.options['config']);
};

//
// ### bootstrap (app, callback)
// #### @app {broadway.App} Application to bootstrap
// #### @callback {function} Continuation to respond to when complete.
// Runs the initialization step of the bootstrapping process
// for the specified `app`. 
//
exports.init = function (app, callback) {  
  broadway.plugins.config.init.call(app, function (err) {
    if (err) {
      return callback(err);
    }
    
    app.use(broadway.plugins.exceptions, app.options['exceptions'] || {});
    app.use(broadway.plugins.directories, app.options['directories'] || {});
    app.use(broadway.plugins.log, app.options['log'] || {});
    callback();
  })
};