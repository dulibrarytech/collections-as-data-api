'use strict'

const config = require('../config/config');
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client( {  
  hosts: [
    config.elasticHost + ':' + config.elasticPort
  ]
});

client.cluster.health({},function(err,resp,status) {  
	if(err) {
		console.log("Elastic connection error:", err);
		console.log("Could not connect to Elastic cluster");
	}
	else if(status == 200 && resp) {
		console.log("Connected to Elastic cluster: " + config.elasticHost + ':' + config.elasticPort);
		console.log("Using Elastic index: " + config.elasticIndex);
	}
	else {
		console.log("Error: Elastic connection status is: " + status + " while contacting index on " + config.elasticHost + ':' + config.elasticPort);
		console.log("Could not connect to Elastic cluster");
	}
});

module.exports = client;