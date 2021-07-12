'use strict';

var Search = require('./controller'),
	User = require('../user/controller');

module.exports = function (app) {
    app.route('/search')
        .get(User.validateKey, Search.search);
};