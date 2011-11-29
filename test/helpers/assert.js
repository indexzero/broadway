/*
 * assert.js: Assertion helpers for broadway tests
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var assert = module.exports = require('assert'),
    fs = require('fs'),
    path = require('path'),
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
  directories: function (app) {
    if (app.options['directories']) {
      Object.keys(app.options['directories']).forEach(function (key) {
        assert.isTrue(path.existsSync(app.options['directories'][key]));
      });
    }
    //assert.isTrue(!!app.config.get('directories'))
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
    assert.isTrue(!app.config);
  },
  exceptions: function (app) {
    
  },
  directories: function (app) {
    assert.isTrue(!app.config.get('directories'))
  },
  log: function (app) {
    assert.isTrue(!app.log);
    //
    // TODO: Assert winston.extend methods
    //    
  }
};