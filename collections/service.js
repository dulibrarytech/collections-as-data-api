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
				reject(error);
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
		})
	});
}