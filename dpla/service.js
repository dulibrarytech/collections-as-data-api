'use strict';

const es = require('../config/index'),
      config = require('../config/config'),
      dplaConfig = require('../config/config-dpla'),
      Collections = require('../collections/service');

const JsonParser = require('../libs/json-parser.js');

var createDataObject = function(collectionObjects, callback) {
	var objects = [], object, fields = {};
	// collectionObjects should be a 2D array
		//console.log("createDataObject", collectionObjects)

	for(var collection of collectionObjects) {
		for(var item of collection) {
			object = item._source || {};
				//console.log("TEST object", item)
			fields = {};

			// Fields not in configuration (built-in)
			fields["dataProvider"] = "University of Denver";
			fields["isShownAt"] = config.objectAccessDomain + config.objectAccessPath + "/" + (object.pid || "null") + config.objectAccessParams;
			fields["rights"] = "{Rights Statement}";
			fields["preview"] = config.thumbnailAccessDomain + config.thumbnailAccessPath + "/" + (object.pid || "null") + config.thumbnailAccessParams;
			fields["collectionTitle"] = object.collection_title;
			fields["collectionUrl"] = config.objectAccessDomain + config.objectAccessPath + "/" + (object.is_member_of_collection || "null") + config.objectAccessParams;
			fields["iiifManifest"] = config.iiifAccessDomain + config.iiifAccessPath + "/" + (object.pid || "null") + config.iiifAccessParams;

			var data = {};
			JsonParser.getItemMetadataValues(dplaConfig.itemMetadataFields["default"], object, data);

			for(var key in data) {
				if(dplaConfig.itemMetadataFields["default"][key].display == "text" && typeof data[key] == "object") {
					fields[key] = data[key].toString();
				}
				else {
					fields[key] = data[key];
				}
			}

			objects.push(fields);
		}
	}

	console.log("Returning " + objects.length + " objects");
	callback(null, objects);
}

exports.getObjectArray = async function(callback) {
	var objectArray = [],
			collectionCount,
			collectionTitles = {},
			collections = [];

	// Get collection pid/title list
	Collections.getCollectionList().catch(error => {
		console.log(error);
	})
	.then(async list => {

		/*
		 * DEV: Test List
		 */
		list.length = 10;
		/*
		 * End Test List 
		 */

		collectionCount = list.length;
		console.log(collectionCount + " collections found");

		for(var collection of list) {
			collectionTitles[collection.id] = collection.title;
		}

		var response;
		for(var collection of list) {
			console.log("Fetching collection data for", collection.title);
			response = await es.search({
	      index: config.elasticIndex,
	      type: "data",
	      body: {
	      	size: 10000,
	        query: {
	          "bool": {
	            "must": [
	            	{"match": {"is_member_of_collection": collection.id}},
	              {"match": {"object_type": "object"}}
	            ]
	          }
	        }
	      }
		  });

	  	if(response.hits.total > 0) {

      	let objects = response.hits.hits,
      			collectionObjects = [];

      	for(var object of objects) {
      			object._source["collection_title"] = collectionTitles[object._source.is_member_of_collection] || "No collection title";
      			collectionObjects.push(object);
      	}
      	console.log("Adding collection objects for", collectionTitles[object._source.is_member_of_collection]);
      	collections.push(collectionObjects);
      }
      else {
      	console.log("No items found in collection")
      }
		}

		createDataObject(collections, callback);
	});
}