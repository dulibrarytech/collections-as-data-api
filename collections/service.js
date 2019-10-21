'use strict';

const es = require('../config/index'),
      util = require('util'),
      config = require('../config/config'),
      Helper = require("./helper");

exports.getCollectionList = function() {
	return new Promise(function(fulfill, reject) {
		es.search({
			index: config.elasticIndex,
      		type: config.indexType,
      		_source: ["pid", "title"],
      		body: {
      			query: {
      				bool: {
      					filter: [{"match_phrase": {"object_type": "collection"}}]
      				}
      			}
	        }
		},
		function(error, response, status) {
			if(error) {
				reject(error);
			}
			else if(status != 200) {
				reject("Elastic server returned a status of " + status)
			}
			else {
				let collections = response.hits.hits || [],
					list = [];

				for(let collection of collections) {
					list.push({
						id: collection._source.pid || "",
						name: collection._source.title || "No title"
					})
				}
				fulfill(list);
			}
		});
	});
}