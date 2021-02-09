'use strict';
 
const  	config = require('../config/config'),
    	Service = require('./service'),
    	Collections = require('../collections/controller');

exports.getDPLAFeed = function(req, res) {
	var feed = [];
	Service.getObjectArray(function(error, data) {
		if(error) {
			console.log(error);
			res.status(500);
		}
		else if(data.length >= 0) {
			console.log("No objects found");
			res.status(404);
		}
		else {
			// Anything else

			feed = data;
		}

		res.send(JSON.stringify(feed));
	});
}