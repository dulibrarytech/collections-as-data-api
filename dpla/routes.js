'use strict'

var config = require("../config/config-dpla-feed.js"),
    DPLAController = require('./controller');

module.exports = function(app) {
    app.route('/dpla/feed')
        .get(DPLAController.getDPLAFeed);
};