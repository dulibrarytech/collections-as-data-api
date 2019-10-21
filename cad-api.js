require('dotenv').config();

var express = require("./config/express");
var app = express();

app.set('port', (process.env.APPLICATION_PORT || 3000))

app.listen(app.get('port'), () => {
 console.log("Server running on port " + app.get('port'));
});

module.exports = app;
