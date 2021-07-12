'use strict'

var config = require("../config/config.js"),
    Collections = require('./controller'),
    User = require('../user/controller');

module.exports = function(app) {
    app.route('/collections')
        .get(User.validateKey, Collections.collections);

    app.route('/collections/:collection_id')
        .get(User.validateKey, Collections.collection);

    app.route('/collections/:collection_id/items')
        .get(User.validateKey, Collections.collectionItems);

    app.route('/collections/:collection_id/items/:item_id')
        .get(User.validateKey, Collections.collectionItem);

    app.route('/collections/:collection_id/items/:item_id/transcript')
        .get(User.validateKey, Collections.collectionItemTranscript);
};