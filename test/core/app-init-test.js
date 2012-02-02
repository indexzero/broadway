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
  "An initialized instance of broadway.App with two plugins": {
    topic: function () {
      var app = new broadway.App();

      // First plugin. Includes an init step.
      app.use({
        'attach': function () {
          this.place = 'rackspace';
        },

        'init': function (cb) {
          var self = this;

          // a nextTick isn't technically necessary, but it does make this
          // purely async.
          process.nextTick(function () {
            self.letsGo = function () {
              return 'Let\'s go to '+self.place+'!';
            }

            cb();
          });
        }
      });

      // Second plugin. Only involves an "attach".
      app.use({
        'attach': function () {
          this.oneup = function (n) {
            n++;
            return n;
          }
        }
      });

      var that = this;
      app.init(function (err) {
        that.callback(err, app);
      });
    },
    "shouldn't throw an error": function (err, app) {
      assert.ok(!err);
    },
    "should have all its methods attached/defined": function (err, app) {
      assert.ok(app.place);
      assert.isFunction(app.oneup);
      assert.isFunction(app.letsGo);
      assert.equal(2, app.oneup(1));
      assert.equal(app.letsGo(), 'Let\'s go to rackspace!');
    },
  }
}).export(module);
