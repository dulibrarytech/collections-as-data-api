'use strict';
 
const  	config = require('../config/config'),
    	Service = require('./service'),
    	Helper = require('./helper');

var sendErrorResponse = function(res, error) {
	console.error(error);
	res.status(500);
	res.send({
		http_status_code: 500,
		error_message: error,
		data: {}
	})
}

exports.search = function(req, res) {
	let query = req.query.q || ["*"],
		field = req.query.field || ["all"], 
		type = req.query.type || ["contains"],
		bool = req.query.bool || ["or"],
		facets = req.query.f || null,
		page = req.query.page || 1,
		pageSize = req.query.size || config.maxResultsPerPage,
		sort = req.query.sort || null,
		collection = req.query.collection || null,
		range = req.query.range || null,
		advancedSearch = req.query.advancedSearch && req.query.advancedSearch == "true" ? true : false,
		includeAggData = req.params.aggs && req.params.aggs == "true" ? true : false;

	try {
		if(typeof query == "string") {
			Service.luceneSearchIndex(query, page, pageSize, function(error, response) {
				if(error) {
					sendErrorResponse(res, error.message);
				}
				else {
					res.send(response);
				}
			});
		}

		else {
			let sortBy = Helper.getSortDataArray(sort),
			 	queryData = Helper.getSearchQueryDataObject(query, field, type, bool),
			 	daterange = Helper.getDateRangeObject(range);

			Service.searchIndex(queryData, facets, collection, page, pageSize, daterange, sortBy, advancedSearch, function(error, response) {
				if(error) {
					sendErrorResponse(res, error.message);
				}
				else {
					res.send(response);
				}	
			});
		}
	}
	catch(e) {
		sendErrorResponse(res, e.message);
	}
}