 /**
 * @file 
 *
 * express.js bootstrap file
 */

'use strict';

var express = require('express'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    config = require('./config.js');

module.exports = function () {
    var app = express();

    app.use(compression());
    app.use(express.static('./public'));
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());

    app.route('/')
        .get(function(req, res) {
            res.sendStatus(403);
    });

    //require('../libs/database.js');

    require('../dpla/routes.js')(app);
    require('../api-form/routes.js')(app);
    require('../collections/routes.js')(app);
    require('../search/routes.js')(app);
    require('../user/routes.js')(app);
    require('../test/unit/routes.js')(app);

    return app;
};