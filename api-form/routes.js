'use strict'

var config = require("../config/config.js"),
    Keys = require("../libs/keys.js"),
	ApiForm = require('./controller'),
    User = require('../user/controller');

module.exports = function(app) {
    app.route('/form')
        .get(ApiForm.renderForm)

    app.route('/form/termsOfUse')
        .get(ApiForm.renderTermsOfUse)

    app.route('/form/validateKey')
        .get(ApiForm.validateKey)

    app.route('/form/requestKey')
        .post(ApiForm.requestApiKey)

    app.route('/template/:name')
        .get(ApiForm.getTemplate)
};

