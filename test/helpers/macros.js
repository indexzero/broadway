/*
 * macros.js: Test macros for using broadway and vows
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var events = require('eventemitter2'),
    assert = require('./assert'),
    broadway = require('../../lib/broadway');

var macros = exports;

macros.shouldExtend = function (plugin) {
  return {
    "extending an application": {
      topic: function () {
        var app = new events.EventEmitter2({ delimiter: '::', wildcard: true });
        broadway.plugins[plugin].init(app, {}, this.callback)
      },
      "should add the appropriate properties and methods": function (err, app) {
        assert.isTrue(!err);
        assert.plugins.has[plugin](app);
      }
    }
  }
}