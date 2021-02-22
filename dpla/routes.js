'use strict'

var config = require("../config/config-dpla.js"),
    DPLAController = require('./controller');

module.exports = function(app) {
    app.route('/dplaFeed')
        .get(DPLAController.getDPLAFeed);
};