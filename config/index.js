'use strict'

const config = require('../config/config');
const { Client } = require('@elastic/elasticsearch');

let elastic_client = null;
let elasticDomain = `${config.elasticHost}:${config.elasticPort}`;

console.log(`Connecting to Elastic server at domain: ${elasticDomain}...`);

try {
	elastic_client = new Client({
		node: elasticDomain,
		tls: {
			rejectUnauthorized: false
		}
	});
}
catch (error) {
	console.error(`Could not connect to Elastic server. Error: ${error}`);
}

if(elastic_client) {

   elastic_client.info().then(function (response) {
	 console.log(`Connected to Elastic server. Server info:`, response)

   }, function (error) {
	 console.error(`Could not connect to Elastic server. Elastic client error: ${error}`);
   });
}
else {
   console.log(`Cound not connect to Elastic server. No error report available`);
}

module.exports = elastic_client;