/*
 * assert.js: Assertion helpers for broadway tests
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var assert = module.exports = require('assert'),
    nconf = require('nconf'),
    vows = require('vows');

//
// ### Assertion helpers for working with `broadway.App` objects.
//
assert.app = {};

//
// ### Assertion helpers for working with `broadway.plugins`.
//
assert.plugins = {};

//
// ### Assert that an application has various plugins.
//
assert.plugins.has = {
  config: function (app, config) {
    assert.instanceOf(app.config, nconf.Provider);
    if (config) {
      //
      // TODO: Assert that all configuration has been loaded
      //
    }
  },
  exceptions: function (app) {
    
  },
  log: function (app) {
    assert.isObject(app.log);
    
    //
    // TODO: Assert winston.extend methods
    //
  }
};

//
// ### Assert that an application doesn't have various plugins
//
assert.plugins.notHas = {
  config: function (app) {
    
  },
  exceptions: function (app) {
    
  },
  log: function (app) {
    assert.isTrue(!app.log);
    //
    // TODO: Assert winston.extend methods
    //    
  }
};