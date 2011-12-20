(function (exports) {
  exports.HelloWorld = {
    // `exports.attach` gets called by broadway on `app.use`
    attach: function (options) {
      this.hello = function (world) {
        console.log("Hello "+ world + options.delimiter || ".");
      }
    },
    // `exports.init` gets called by broadway on `app.init`.
    init: function (done) {
      // This plugin doesn't require any initialization step.
      return done();
    }
  };
}(window));
