'use strict';
 
const  	config = require('../config/config'),
    	Service = require('./service'),
    	Helper = require('./helper');

var sendResponseObject = function(res, status, response, message="") {
	res.status(status);
	res.send({
		http_status_code: status,
		message: message,
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
		let message = response && response.length > 0 ? "" : "No collections found";
		sendResponseObject(res, 200, response, message);
	});
}

exports.collection = function(req, res) {
	if(req.params && req.params.collection_id) {
		let collectionID = req.params.collection_id;
		Service.getCollectionData(collectionID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			let status = Object.keys(response).length === 0 ? 404 : 200;
			let message = status == 404 ? "Collection not found" : "";
			sendResponseObject(res, status, response, message);
		});
	}
	else {
		sendResponseObject(res, 400, {});
	}
}

exports.collectionItems = function(req, res) {
	if(req.params && req.params.collection_id) {
		let collectionID = req.params.collection_id;
		Service.getCollectionItems(collectionID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			let status = response ? 200 : 404;
			let message = status == 404 ? "Collection not found" : "";
			sendResponseObject(res, status, response || [], message);
		});
	}
	else {
		sendResponseObject(res, 400, {});
	}
}

exports.collectionItem = function(req, res) {
	if(req.params && req.params.collection_id && req.params.item_id) {
		let collectionID = req.params.collection_id,
			itemID = req.params.item_id;
		Service.getItemData(collectionID, itemID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			let status, message = "", data = {};
			if(response === false) {
				status = 400;
				message = "Collection not found";
			}
			else if(response === null) {
				status = 404;
				message = "Item not found";
			}
			else {
				status = 200;
				data = response;
			}
			sendResponseObject(res, status, data, message);
		});
	}
	else {
		sendResponseObject(res, 400, {});
	}
}

exports.collectionItemTranscript = function(req, res) {
	if(req.params && req.params.collection_id && req.params.item_id) {
		let collectionID = req.params.collection_id,
			itemID = req.params.item_id;
		Service.getItemTranscript(collectionID, itemID).catch(error => {
			sendErrorResponse(res, error);
		})
		.then(response => {
			let status, message = "", data = "";
			if(response === false) {
				status = 400;
				message = "Collection not found";
			}
			else if(response === null) {
				status = 404;
				message = "Item not found";
			}
			//detect empty string, return 404
			else if(response.length == 0) {
				status = 404;
				message = "No transcript available for this item";
			}
			else {
				status = 200;
				data = response;
			}
			sendResponseObject(res, status, data, message);
		});
	}
	else {
		sendResponseObject(res, 400, {});
	}
}