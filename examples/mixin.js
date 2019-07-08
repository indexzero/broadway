var express = require('express'),
  App = require('../');

//
// Create a new base App.
//
var app = new App();

//
// Then mixin `express` functionality later on. This
// can be called multiple times. By default: it will
// only define a single property on your app once.
//
app.mixin(express());

//
// Do anything you want asynchronously before
// the application starts.
//
app.preboot(function (app, options, next) {
  console.log('Starting up...');
  next();
});

//
// Start listening on HTTP port passed in
// explicitly at start-time below.
//
app.start({ http: 8080 }, function (err) {
  if (err) {
    console.error('Error on startup: %s', err.message);
    return process.exit(1);
  }

  console.log('Listening over HTTP on port %s', this.given.http);
});
