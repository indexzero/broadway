'use strict';

var assert = require('assert'),
    express = require('express'),
    App = require('../');

/*
 * Simple helper function that creates a basic
 * app that mixes in express.
 */
function expressApp(port) {
  var options = typeof port === 'number'
    ? { http: port }
    : port;

  return new App(options, express());
}

describe('broadway', function () {
  it('should define the correct interface', function () {
    var app = new App();
    assert.ok(app.preboot);
    assert.ok(app.mixin);
    assert.ok(app.start);
    assert.ok(app.close);
    assert.ok(app.config.get);
    assert.ok(app.perform);
    assert.ok(app._listen);
  });

  describe('new App(options?, [base])', function () {
    it('should accept only options', function () {
      var app = new App({ http: 8080 });
      assert.equal(app.options.http, 8080);
    });

    it('should accept options and a base', function () {
      var base = { method: function () { } },
          app = new App({ http: 8080 }, base);

      assert.equal(app.options.http, 8080);
      assert.equal(app.method, base.method);
    });

    it('should define a config shim', function () {
      var app = new App({ http: 8080 });
      assert.equal(app.config.get('http'), 8080);
    });
  });

  describe('.preboot(fn)', function () {
    it('should be called on an sync start', function () {
      var app = expressApp(8082);

      // Override this for testing purposes.
      app._listen = function (callback) { callback(); };

      var count = 0;
      app.preboot(function (app, options, next) {
        count++;
        next();
      });

      app.start(function (err) {
        assert.ok(!err);
        assert.equal(count, 1);
      });
    });
  });

  describe('.start([options], callback', function () {
    it('should mixin any options provided', function () {
      var app = new App();

      // Override this for testing purposes.
      app._listen = function (callback) { callback(); };

      app.start({ http: 8080 }, function (err) {
        assert.ok(!err);
        assert.equal(app.options.http, 8080);
      });
    });

    it('should listen on any port provided', function (done) {
      var app = expressApp(8081);

      app.start(function (err) {
        assert.ok(!err);
        assert.ok(app.servers);
        assert.ok(app.servers.http);
        done();
      });
    });

    it('should error if `app.handle` is not defined', function (done) {
      var app = new App({ http: 8082 });
      app.start(function (err) {
        assert.equal(err.message, 'A handle function must be defined.');
        done();
      });
    });

    it('should error if a `.before("preboot")` errors', function (done) {
      var app = new App({ http: 8090 });
      app.before('preboot', function (app, options, callback) {
        return callback(new Error('Bad preboot'));
      });

      app.start(function (err) {
        assert.ok(err);
        assert.equal(err.message, 'Bad preboot');
        done();
      });
    });
  });

  describe('.close(callback)', function () {
    it('should close a single HTTP server', function (done) {
      var app = expressApp(8083);
      app.start(function (err) {
        assert.ok(!err);
        app.close(function (err) {
          assert.ok(!err);
          done();
        });
      });
    });

    it('should close HTTP and HTTPS servers');

    it('should respnd with an error if a server fails', function (done) {
      var apps = {
        first: expressApp(8084),
        second: expressApp(8084)
      };

      apps.first.start(function (err) {
        assert.ok(!err);
        apps.second.start(function (err) {
          assert.ok(!err.https);
          assert.ok(err.http);
          assert.equal(err.http.code, 'EADDRINUSE');

          apps.first.close(done);
        });
      });
    });

    it('should respond with an error if no servers exist', function (done) {
      var app = expressApp(8085);

      // Override this for testing purposes.
      app._listen = function (callback) { callback(); };

      app.start(function (err) {
        assert.ok(!err);
        app.close(function (err) {
          assert.equal(err.message, 'No servers to close.');
          done();
        });
      });
    });
  });
});
