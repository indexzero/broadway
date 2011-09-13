/*
 * directories-test.js: Tests for working with directories in broadway.
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    vows = require('vows'),
    broadway = require('../../lib/broadway');

var sampleAppPath = path.join(__dirname, '..', 'fixtures', 'sample-app'),
    sampleAppFile = path.join(sampleAppPath, 'broadway.json'),
    appConfig = JSON.parse(fs.readFileSync(sampleAppFile, 'utf8')),
    directories = appConfig.directories;

Object.keys(directories).forEach(function (key) {
  directories[key] = directories[key].replace('#ROOT', sampleAppPath);
});

vows.describe('broadway/common/directories').addBatch({
  "When using broadway.common.directories": {
    "it should have the correct methods defined": function () {
      assert.isObject(broadway.common.directories);
      assert.isFunction(broadway.common.directories.create);
      assert.isFunction(broadway.common.directories.remove);
    },
    "the create() method": {
      topic: function () {
        broadway.common.directories.create(directories, this.callback);
      },
      "should create the specified directories": function (err, dirs) {
        assert.isTrue(!err);
        
        var exists = false;
        dirs.forEach(function (dir) {
          exists = path.existsSync(dir);
        });
        
        assert.isTrue(exists);
      },
      "the destroy() method": {
        topic: function () {
          broadway.common.directories.remove(directories, this.callback);
        },
        "should remove the specified directories": function (err, dirs) {
          assert.isTrue(!err);
          
          var exists = true;
          dirs.forEach(function (dir) {
            exists = path.existsSync(dir);
          });
          
          assert.isFalse(exists);
        }
      }
    }
  }
}).export(module);