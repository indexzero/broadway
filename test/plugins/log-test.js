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
    macros = require('../helpers/macros'),
    broadway = require('../../lib/broadway');
    
vows.describe('broadway/plugins/log').addBatch({
  "Using the log plugin": {
    "to extend an application": macros.shouldExtend('log')
  }
}).export(module);