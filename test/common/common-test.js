/*
 * common-test.js: Tests for common utility functions in broadway.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var assert = require('assert'),
    events = require('eventemitter2'),
    vows = require('vows'),
    broadway = require('../../lib/broadway');

var obj1, obj2;

obj1 = {
  foo: true,
  bar: {
    bar1: true,
    bar2: 'bar2'
  }
};

obj2 = {
  baz: true,
  buzz: 'buzz' 
};
 
vows.describe('broadway/common').addBatch({
  "When using broadway.common": {
    "it should have the correct methods defined": function () {
      assert.isObject(broadway.common);
      assert.isFunction(broadway.common.mixin);
      assert.isFunction(broadway.common.clone);
    },
    "the mixin() method": function () {
      var mixed = broadway.common.mixin({}, obj1, obj2);
      assert.isTrue(mixed.foo);
      assert.isObject(mixed.bar);
      assert.isTrue(mixed.baz);
      assert.isString(mixed.buzz);
    },
    "the clone() method": function () {
      var clone = broadway.common.clone(obj1);
      assert.isTrue(clone.foo);
      assert.isObject(clone.bar);
      assert.notStrictEqual(obj1, clone);
    }
  }
}).export(module);