 /**
 * @file 
 *
 * express.js bootstrap file
 */

'use strict';

var express = require('express'),
    compression = require('compression'),
    config = require('./config.js');

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'production') {
        app.use(compression());
    }

    app.use(express.static('./public'));
    app.set('views', './views');
    app.set('view engine', 'ejs');

    require('../api-form/routes.js')(app);
    require('../collections/routes.js')(app);
    //require('../collections/routes/api_v1.js')(app);
    require('../search/routes.js')(app);

    return app;
};