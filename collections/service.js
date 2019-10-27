'use strict';

const es = require('../config/index'),
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

exports.getCollectionData = function(collectionID) {
	return new Promise(function(fulfill, reject) {
		var data = {};

		// Get the collection data
		queryIndex({
      		_source: ["title", "description", "abstract"],
      		body: {
      			query: {
      				bool: {
      					must:[{"match_phrase": {"pid": collectionID}}],
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
		      					filter:[{"match_phrase": {"is_member_of_collection": collectionID}}]
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

exports.getCollectionItems = function(collectionID) {
	return new Promise(function(fulfill, reject) {
		queryIndex({
      		_source: ["pid", "title"],
      		body: {
      			query: {
      				bool: {
      					filter: [{"match_phrase": {"is_member_of_collection": collectionID}}]
      				}
      			}
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				let items = response.hits.hits || [],
					list = [];

				for(let item of items) {
					list.push({
						id: item._source.pid || "",
						title: item._source.title || "No title"
					})
				}
				fulfill(list);
			}
		})
	});
}

exports.getItemData = function(collectionID, itemID) {
	return new Promise(function(fulfill, reject) {
		queryIndex({
      		body: {
      			query: {
      				bool: {
      					filter: [
      						{"match_phrase": {"pid": itemID}},
      						{"match_phrase": {"is_member_of_collection": collectionID}}
      					]
      				}
      			}
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				let item = response.hits.hits[0] || {},
					data = {};

				for(let key in item) {
					data["pid"] = item[key].pid;
					data["title"] = item[key].title || "No title";
					if(item[key].creator && item[key].creator.length > 0) {
						data["creator"] = item[key].creator;
					}  
					if(item[key].abstract && item[key].abstract.length > 0) {
						data["description"] = item[key].abstract;
					} 
					if(item[key].description && item[key].description.length > 0) {
						data["description"] = item[key].description;
					} 
				}
				fulfill(data);
			}
		})
	});
}