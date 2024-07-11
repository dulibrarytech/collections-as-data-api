'use strict';

const es = require('../config/index'),
      config = require('../config/config'),
      Helper = require("./helper"),
      JsonParser = require("../libs/json-parser"),
      Formatter = require("../libs/formatter");

var fetchCollection = function(id, callback) {
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
			callback(error, null);
		}
		else {
			callback(null, response);
		}
	});
}

exports.getCollectionData = function(collectionID) {
	return new Promise(function(fulfill, reject) {
		var data = {};
		fetchCollection(collectionID, function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				if(response.hits.hits && response.hits.hits.length > 0) {
					let collection = response.hits.hits;
					data["title"] = collection[0]._source.title || "No title";
					data["description"] = collection[0]._source.abstract || collection[0]._source.description || "No description";

					// Count the members of the collection
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
					});
				}
				else {
					fulfill(data);
				}
			}
		});
	});
}

exports.getCollectionItems = function(collectionID) {
	return new Promise(function(fulfill, reject) {
		queryIndex({
      		_source: ["pid", "title", "type", "mime_type", "object_type", "transcript", "transcript_search"],
      		body: {
      			query: {
      				bool: {
      					filter: [{"match_phrase": {"is_member_of_collection": collectionID}}]
      				}
      			},
	  			"sort" : [
			        { "title.keyword" : {"order" : "asc"}}
			    ]
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				try {
					let items = response.hits.hits || [],
						list = [];

					if(response.hits.hits && response.hits.hits.length > 0) {
						for(let item of items) {
							list.push({
								id: item._source.pid || "",
								object_type: item._source.object_type || "undefined",
								mime_type: item._source.mime_type || "",
								title: item._source.title || "No title",
								transcript: (item._source.transcript || item._source.transcript_search) ? true : false
							})
						}
						fulfill(list);
					}
					else {
						fulfill(false);
					}
				}
				catch(e) {
					reject(e.message);
				}
			}
		});
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
      			},
	  			"sort" : [
			        { "title.keyword" : {"order" : "asc"}}
			    ]
	        }
		},
		function(error, response) {
			if(error) {
				reject("Elastic error: " + error.message);
			}
			else {
				try {
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
				catch(e) {
					reject(e.message);
				}
			}
		});
	});
}

exports.getItemData = function(collectionID, itemID) {
	return new Promise(function(fulfill, reject) {
		fetchCollection(collectionID, function(error, response) {
			if(response.hits.total.value > 0) {
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
						var data = {};
						try {
							if(response.hits.hits && response.hits.hits.length > 0) {
								let item = response.hits.hits[0]._source || {};
								let extension = item.object ? item.object.substring(item.object.length - 3) : null;

								JsonParser.getItemMetadataValues(config.itemMetadataFields, item, data);
								Formatter.getRepositoryResourceUrl(data, extension);
								fulfill(Helper.addMetadataAttributes(data));
							}
							else {
								fulfill(null);
							}
						}
						catch(e) {
							reject(e.message);
						}
					}
				});
			}
			else {
				fulfill(false);
			}
		});
	});
}

exports.getItemTranscript = function(collectionID, itemID) {
	return new Promise(function(fulfill, reject) {
		fetchCollection(collectionID, function(error, response) {
			if(response.hits.total.value > 0) {
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
						var data = {};
						try {
							if(response.hits.hits && response.hits.hits.length > 0) {
								let item = response.hits.hits[0]._source || {},
										transcript = "";

								if(item.is_compound == true) {
									let parts = item.display_record.parts || [],
											order;

									transcript += "\"";
									for(var part of parts) {
										order = part.order || "";
										if(part.transcript) {
											transcript = transcript.concat(`\n[Page ${order}]\n`, part.transcript)
										}
										else {
											transcript = transcript.concat(`\n[Page ${order}]\n`, "Transcript not available for this page")
										}
									}
									transcript += "\n\"";

									if(transcript.length == 0) {
										transcript = "Transcript not found";
									}
								}
								else {
									transcript = item.transcript || item.transcript_search;
								}

								fulfill(transcript);
							}
							else {
								fulfill(null);
							}
						}
						catch(e) {
							reject(e.message);
						}
					}
				});
			}
			else {
				fulfill(false);
			}
		});
	});
}

var queryIndex = function(data, callback) {
	data["index"] = config.elasticIndex;
	data["from"] = 0;
	data["size"] = 10000;

	es.search(data).then(function (response) {
		if(response) {
		  	callback(null, response) 
		}
		else {
		  	callback("Null search response from Elastic", null);
		}
	  }, function (error) {
			console.error("Elastic error: %s", error.message);
			console.error("Elastic returned a status of: %s", error.statusCode);
			callback(error, null);
	  });
}