/*
 * app-test.js: Tests for core App methods and configuration.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var events = require('eventemitter2'),
    vows = require('vows'),
    assert = require('../helpers/assert'),
    broadway = require('../../lib/broadway');
    
vows.describe('broadway/app').addBatch({
  "An instance of broadway.App": {
    topic: new broadway.App(),
    "should have the correct properties and methods": function (app) {
      //
      // Instance
      //
      assert.isObject(app);
      assert.instanceOf(app, events.EventEmitter2);
      assert.instanceOf(app, broadway.App);
      
      //
      // Properties
      //
      assert.isObject(app.plugins);
      assert.isObject(app.plugins.config);
      assert.isObject(app.plugins.exceptions);
      assert.isObject(app.plugins.log);
      assert.isObject(app.initialized);
      assert.isFalse(!!app.initialized['core']);
      
      //
      // Methods
      //
      assert.isFunction(app.init);
      assert.isFunction(app.inspect);
    },
    "the init() method": {
      topic: function (app) {
        this.app = app;
        app.init(this.callback);
      },
      "should correctly setup the application state": function () {
        assert.isTrue(this.app.initialized['config']);
        assert.isTrue(this.app.initialized['core']);
        assert.isTrue(this.app.initialized['exceptions']);
        assert.isTrue(this.app.initialized['log']);
        
        assert.plugins.has.config(this.app);
        assert.plugins.has.log(this.app);
      }
    }
  }
}).export(module);