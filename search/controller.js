'use strict';

const async = require('async'),
    config = require('../config/' + process.env.CONFIGURATION_FILE),
    Service = require('./service.js'),
    Facets = require('../libs/facets'),
    Paginator = require('../libs/paginator'),
    Helper = require('./helper.js'),
    Metadata = require('../libs/metadata'),
    Format = require("../libs/format");

exports.search = function(req, res) {
	let query = req.query.q || [""],
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

	let sortBy = Helper.getSortDataArray(sort),
	 	queryData = Helper.getSearchQueryDataObject(query, field, type, bool),
	 	daterange = Helper.getDateRangeObject(range);

	Service.searchIndex(queryData, facets, collection, page, pageSize, daterange, sortBy, advancedSearch, function(error, response) {
		if(error) {
			console.error(error);
			res.status(500);
			res.send(error);
		}
		else {
			res.send(response);
		}
	});
}