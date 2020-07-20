'use strict'

var ApiForm = require('./controller');

module.exports = function(app) {
    app.route('/form')
        .get(ApiForm.renderForm)

    app.route('/template/:name')
        .get(ApiForm.getTemplate)
};

