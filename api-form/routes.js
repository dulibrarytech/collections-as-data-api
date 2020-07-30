'use strict'

var config = require("../config/config.js"), 
	ApiForm = require('./controller');

module.exports = function(app) {
	var validateKey = function(req, res, next) {
        if(req.query.key && req.query.key == config.apiKey ||
            config.nodeEnv == "development") {
            next();
        }
		else {
             res.status(403).send('API key is required')
        }
	}

    app.route('/form')
        .get(ApiForm.renderForm)

    app.route('/form/termsOfUse')
        .get(ApiForm.renderTermsOfUse)

    app.route('/form/validateKey')
        .get(ApiForm.validateKey)

    app.route('/form/requestKey')
        .post(ApiForm.sendApiKeyEmail)

    app.use(validateKey);

    app.route('/template/:name')
        .get(ApiForm.getTemplate)
};

