/*
 * app.js: Common utility functions for working with directories
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var utile = require('utile'),
    async = utile.async,
    mkdirp = utile.mkdirp,
    rimraf = utile.rimraf,
    constants = require('../constants');

var directories = exports;
    
//
// ### function create (dirs, callback)
// #### @dirs {Object} Directories to create
// #### @callback {function} Continuation to respond to when complete
// Creates all of the specified `directories` in the current environment. 
//
directories.create = function (dirs, callback) {
  function createDir(dir, next) {
    mkdirp(dir, 0755, function () {
      next(null, dir);
    });
  }

  if (!dirs) {
    return callback();
  }

  async.mapSeries(Object.keys(dirs).map(function (key) {
    return dirs[key]
  }), createDir, callback);
};

//
// ### function remove (dirs, callback)
// #### @dirs {Object} Directories to remove
// #### @callback {function} Continuation to respond to when complete
// Removes all of the specified `directories` in the current environment. 
//
directories.remove = function (dirs, callback) {
  function removeDir (dir, next) {
    rimraf(dir, function () {
      next(null, dir);
    });
  }
  
  if (!dirs) {
    return callback();
  }
  
  async.mapSeries(Object.keys(dirs).map(function (key) {
    return dirs[key]
  }), removeDir, callback);
};

//
// ### function normalize (root, dirs)
// #### @root {string} Relative root of the application
// #### @dirs {Object} Set of directories to normalize.
// Normalizes the specified `dirs` against the relative
// `root` of the application.
//
directories.normalize = function (root, dirs) {
  var normalized = {};
  
  Object.keys(dirs).forEach(function (key) {
    normalized[key] = dirs[key].replace(constants.ROOT, root);
  });
  
  return normalized;
};