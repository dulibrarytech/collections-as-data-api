'use strict';

var Search = require('./controller');

module.exports = function (app) {
    app.route('/search')
        .get(Search.search);
};