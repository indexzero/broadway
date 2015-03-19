# broadway [![Build Status](https://secure.travis-ci.org/indexzero/broadway.png)](http://travis-ci.org/indexzero/broadway)

_*Lightweight App extensibility and middleware customization.*_

## Usage

`broadway` is designed to be the littlest possible extensibility for server applications. It is does not take any other external dependencies besides those to expose basic "start middleware".

Additional functionality may be added through `.mixin(base, redefine)`:

``` js
'use strict';

var express = require('express'),
    App = require('broadway');

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

  console.log('Listening over HTTP on port %s', this.options.http);
});
```

### "Hookable" middleware

Because `broadway` exposes a generic hook mechanism from [understudy] it is possible to write hooks into your middleware easily. Consider the following example that defines hookable "auth" handlers into its existing authorization middleware:

```
'use strict';

var express = require('express'),
    basicAuth = require('basic-auth'),
    App = require('broadway');

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

// ... continue starting the app as usual.
```

## Tests
All tests are written with [mocha] and should be run with `npm`:

``` bash
  $ npm test
```

#### [Charlie Robbins](https://github.com/indexzero)
#### License: MIT

[mocha]: http://mochajs.org/
[understudy]: https://github.com/bmeck/understudy
