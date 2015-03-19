'use strict';

var express = require('express'),
    basicAuth = require('basic-auth'),
    App = require('../');

//
// Create an app with default http options,
// mixin all express functions
//
var app = new App({ http: 8080 }, express());

//
// Define a simple "auth" middleware that only
// performs Basic Auth.
//
app.use(function auth(req, res, next) {
  //
  // Before checking and/or parsing the Basic Auth
  // header allow others to attempt their auth methods.
  //
  app.perform('auth', req, res, function (done) {
    var creds = basicAuth(req);

    if (req.authed) {
      return done();
    }
    else if (!creds || creds.name !== 'bob' || creds.pass !== 'secret') {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="example"' });
      res.end('Unauthorized\n');
      return;
    }

    done();
  }, next);
});

//
// Hook into the new "auth middleware" defined above
// to add support for the `X-AUTH-TOKEN` header.
//
app.before('auth', function (req, res, next) {
  var bearerToken = req.headers['x-auth-token'];

  if (bearerToken === 'golden-ticket') {
    req.authed = true;
  }

  next();
});

//
// Start listening on HTTP port passed in
// explicitly at start-time below.
//
app.start(function (err) {
  if (err) {
    console.error('Error on startup: %s', err.message);
    return process.exit(1);
  }

  console.log('Listening over HTTP on port %s', this.options.http);
});
