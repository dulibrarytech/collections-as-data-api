require('dotenv').config();

var express = require("./config/express");
var app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;

app.set('port', (process.env.APPLICATION_PORT || 3000))

app.listen(app.get('port'), () => {
 console.log("App server running on port " + app.get('port'));
});

module.exports = app;
