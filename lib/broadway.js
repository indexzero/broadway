/*
 * broadway.js: Top-level include for the broadway module. 
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var fs = require('fs');

var broadway = exports;

broadway.App      = require('./broadway/app').App;
broadway.common   = require('./broadway/common');
broadway.features = require('./broadway/features');
broadway.plugins  = {};

//
// Define each of our plugins as a lazy loaded `require` statement
//
fs.readdirSync(__dirname + '/broadway/plugins').forEach(function (plugin) {
  plugin = plugin.replace('.js', '');
  broadway.plugins.__defineGetter__(plugin, function () {
    return require('./broadway/plugins/' + plugin);
  });
});