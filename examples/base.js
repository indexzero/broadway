'use strict';

var express = require('express'),
    App = require('../');

//
// Create an app with default http options,
// mixin all express functions
//
var app = new App({ http: 8080 }, express());

//
// Do anything you want asynchronously before
// the application starts.
//
app.preboot(function (app, options, next) {
  console.log('Starting up...');
  next();
});

//
// Start listening on HTTP port passed in to
// App when it was created above.
//
app.start(function (err) {
  if (err) {
    console.error('Error on startup: %s', err.message);
    return process.exit(1);
  }

  console.log('Listening over HTTP on port %s', this.given.http);
});
