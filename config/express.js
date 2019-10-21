 /**
 * @file 
 *
 * express.js bootstrap file
 */

'use strict';

var express = require('express'),
    config = require('./config.js');

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'prod') {
        app.use(compress());
    }

    require('../collections/routes.js')(app);
    require('../search/routes.js')(app);

    return app;
};