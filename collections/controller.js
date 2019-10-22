'use strict';
 
const  	config = require('../config/config'),
    	Service = require('./service'),
    	Helper = require('./helper');

var sendErrorResponse = function(res, error) {
	console.error(error);
	res.status(500);
	res.send(error);
}

exports.collections = function(req, res) {
	Service.getCollectionList().catch(error => {
		sendErrorResponse(res, error);
	})
	.then(response => {
		res.send(response);
	});
}

exports.collection = function(req, res) {
	if(req.params && req.params.id) {
		let collectionID = req.params.id;
		Service.getCollectionData(collectionID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			res.send(response);
		});
	}
	else {
		res.sendStatus(400);
	}
}

exports.collectionItems = function(req, res) {
	// Service.getCollectionItems(collectionID)
	res.send("collectionItems");
}

exports.collectionItem = function(req, res) {
	// Service.getItemData(collectionID, itemID)
	res.send("collectionItem");
}