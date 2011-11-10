exports.attach = function (options) {

  this.hello = function (world) {
    console.log("Hello "+ world + options.delimiter || ".");
  }

};

exports.init = function (done) {

  // This plugin doesn't require any initialization step.
  return done();

};
