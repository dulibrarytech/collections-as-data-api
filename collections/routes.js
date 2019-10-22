'use strict'

var Collections = require('./controller');

module.exports = function (app) {

	var validateKey = function(req, res, next) {
		// Validate the api key
		next();
	}
	app.use(validateKey);

    app.route('/')
        .get(function(req, res) {
            res.sendStatus(403);
    });

    app.route('/collections')
        .get(Collections.collections);

    app.route('/collections/:id')
        .get(Collections.collection);

    app.route('/collections/:id/items')
        .get(Collections.collectionItems);

    app.route('/collections/:collection_id/items/:item_id')
        .get(Collections.collectionItem);
};