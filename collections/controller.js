'use strict';
 
const  	config = require('../config/config'),
    	Service = require('./service'),
    	Helper = require('./helper');

var sendResponseObject = function(res, status, response) {
	res.status(status);
	res.send({
		http_status_code: status,
		data: response
	});
}

var sendErrorResponse = function(res, error) {
	console.error(error);
	res.status(500);
	res.send({
		http_status_code: 500,
		error_message: error,
		data: {}
	})
}

exports.collections = function(req, res) {
	Service.getCollectionList().catch(error => {
		sendErrorResponse(res, error);
	})
	.then(response => {
		sendResponseObject(res, 200, response);
	});
}

exports.collection = function(req, res) {
	if(req.params && req.params.id) {
		let collectionID = req.params.id;
		Service.getCollectionData(collectionID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			sendResponseObject(res, 200, response);
		});
	}
	else {
		sendResponseObject(res, 400, {});
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