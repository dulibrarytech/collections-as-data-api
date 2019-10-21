'use strict'

var Collections = require('./controller');

module.exports = function (app) {

    app.route('/')
        .get(function(req, res) {
            res.sendStatus(403);
    });

    app.route('/collections')
        .get(Collections.collections);

    app.route('/collections/:collection_id')
        .get(Collections.collection);

    app.route('/collections/:id/items')
        .get(Collections.collectionItems);

    app.route('/collections/:collection_id/items/:item_id')
        .get(Collections.collectionItem);
};