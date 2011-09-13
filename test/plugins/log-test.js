/*
 * log-test.js: Tests for the broadway logger plugin
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var vows = require('vows'),
    events = require('eventemitter2'),
    assert = require('../helpers/assert'),
    helpers = require('../helpers/helpers'),
    macros = require('../helpers/macros'),
    broadway = require('../../lib/broadway');

var app = helpers.mockApp();

vows.describe('broadway/plugins/log').addBatch({
  "Using the log plugin": {
    "to extend an application": macros.shouldExtend(app, 'log', {
      "when the application emits log::* events": macros.shouldLogEvent({
        name: 'log::info', 
        message: 'some info message', 
        meta: { foo: 'bar' }
      })
    })
  }
}).addBatch({
  "Using the log plugin": {
    "when the application emits log::*::* events": macros.shouldLogEvent(app, {
      name: 'log::some-category::info', 
      message: 'some info message', 
      meta: { foo: 'bar' }
    })
  }
}).export(module);