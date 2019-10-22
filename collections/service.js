'use strict';

const es = require('../config/index'),
      util = require('util'),
      config = require('../config/config'),
      Helper = require("./helper");

var queryIndex = function(data, callback) {
	data["index"] = config.elasticIndex;
	data["type"] = config.indexType;
	es.search(data, function(error, response, status) {
		if(error) {
			console.error("Elastic error: %s", error.message);
			console.error("Elastic returned a status of: %s", error.statusCode);
			callback(error, null);
		}
		else if(status != 200) {
			callback("Elastic server returned a status of " + status, null)
		}
		else {
			callback(null, response);
		}
	});
}

exports.getCollectionList = function() {
	return new Promise(function(fulfill, reject) {
		queryIndex({
      		_source: ["pid", "title"],
      		body: {
      			query: {
      				bool: {
      					filter: [{"match_phrase": {"object_type": "collection"}}]
      				}
      			}
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				let collections = response.hits.hits || [],
					list = [];

				for(let collection of collections) {
					list.push({
						id: collection._source.pid || "",
						title: collection._source.title || "No title"
					})
				}
				fulfill(list);
			}
		})
	});
}

exports.getCollectionData = function(id) {
	return new Promise(function(fulfill, reject) {
		var data = {};

		// Get the collection data
		queryIndex({
      		_source: ["title", "description", "abstract"],
      		body: {
      			query: {
      				bool: {
      					must:[{"match_phrase": {"pid": id}}],
      					filter: [{"match_phrase": {"object_type": "collection"}}]
      				}
      			}
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				if(response.hits.hits && response.hits.hits.length > 0) {
					let collection = response.hits.hits;
					data["title"] = collection[0]._source.title || "No title";
					data["description"] = collection[0]._source.abstract || collection[0]._source.description || "No description";
				}

				// Count the members of this collection
				queryIndex({
		      		_source: [],
		      		body: {
		      			query: {
		      				bool: {
		      					must:[{"match_phrase": {"is_member_of_collection": id}}]
		      				}
		      			}
			        }
				},
				function(error, response) {
					if(error) {
						reject("Elastic error: " + error.message);
					}
					else {
						if(response.hits.hits) {
							data["item_count"] = response.hits.hits.length;
						}
						fulfill(data)
					}
				})
			}
		})
	});
}