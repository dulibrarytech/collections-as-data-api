/**
 * @file 
 *
 * Search Routes
 *
 */

'use strict';

var Search = require('../search/controller');

module.exports = function (app) {
	app.route('/collections')
        .get(Search.collections);

    app.route('/collections/:collection_id')
        .get(Search.collection);

    app.route('/collections/:id/items')
        .get(Search.collectionItems);

    app.route('/collections/:collection_id/items/:item_id')
        .get(Search.collectionItem);

    app.route('/search')
        .get(Search.search);
};