/*
 * macros.js: Test macros for using broadway and vows
 *
 * (C) 2011, Nodejitsu Inc.
 * MIT LICENSE
 *
 */
 
var events = require('eventemitter2'),
    assert = require('./assert'),
    helpers = require('./helpers'),
    broadway = require('../../lib/broadway');

var macros = exports;

macros.shouldExtend = function (app, plugin, vows) {
  if (arguments.length === 1) {
    plugin = app;
    app = vows = null;
  }
  else if (arguments.length === 2) {
    app = helpers.mockApp();
    vows = plugin;
    plugin = app;
  }
  
  var context = {
    topic: function () {
      app = app || helpers.mockApp();
      broadway.plugins[plugin].attach.call(app, app.options[plugin] || {});
      
      if (broadway.plugins[plugin].init) {
        return broadway.plugins[plugin].init.call(app, this.callback.bind(this, null, app));
      }
      
      this.callback(null, app);
    },
    "should add the appropriate properties and methods": function (_, app) {
      assert.plugins.has[plugin](app);
    }
  }
  
  return extendContext(context, vows);
};

macros.shouldLogEvent = function (app, event) {
  if (arguments.length === 1) {
    event = app;
    app = null;
  }
  
  return {
    topic: function () {
      app = app || helpers.findApp.apply(null, arguments);
      var logger = app.log.get('default');
          
      this.event = event;
      app.once('broadway::logged', this.callback.bind(this, null));
      app.emit(event.name, event.message, event.meta);
    },
    "should log the appropriate info": function (err, level, msg, meta) {
      assert.equal(level, this.event.name.split('::').pop());
      assert.equal(msg, this.event.message);
      assert.equal(meta, this.event.meta);
      assert.isTrue(true);
    }
  };
};

function extendContext (context, vows) {
  if (vows) {
    if (vows.topic) {
      console.log('Cannot include topic at top-level of nested vows:');
      console.dir(vows, 'vows');
      process.exit(1);
    }
    
    Object.keys(vows).forEach(function (key) {
      context[key] = vows[key];
    });
  }
  
  return context;
}