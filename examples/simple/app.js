var broadway = require("broadway");

var app = new broadway.App();

var helloWorld = require("./plugins/helloworld");

app.use(helloWorld, { "delimiter": "!" } );

app.init(function (err) {
  if (err) {
    throw err;
  }
});

app.hello("world");
