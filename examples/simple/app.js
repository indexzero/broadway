var broadway = require("broadway");

var app = new broadway.App();

// Passes the second argument to `helloworld.attach`.
app.use(require("./plugins/helloworld"), { "delimiter": "!" } );

app.init(function (err) {
  if (err) {
    throw err;
  }
});

app.hello("world");
