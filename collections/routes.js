'use strict'

var config = require("../config/config.js"),
    Collections = require('./controller');

module.exports = function(app) {

	var validateKey = function(req, res, next) {
        if(req.query.key && req.query.key == config.apiKey) {
            next();
        }
		else {
             res.status(403).send('API key is required')
        }
	}

    app.route('/')
        .get(function(req, res) {
            res.sendStatus(403);
    });

    app.use(validateKey);
    
    app.route('/collections')
        .get(Collections.collections);

    app.route('/collections/:collection_id')
        .get(Collections.collection);

    app.route('/collections/:collection_id/items')
        .get(Collections.collectionItems);

    app.route('/collections/:collection_id/items/:item_id')
        .get(Collections.collectionItem);

    app.route('/collections/:collection_id/items/:item_id/transcript')
        .get(Collections.collectionItemTranscript);
};