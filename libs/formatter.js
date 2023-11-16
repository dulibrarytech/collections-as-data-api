'use strict'

const config = require("../config/config");

exports.getRepositoryResourceUrl = function(metadataObject) {
	if(metadataObject["Resource URI"]) {
		metadataObject["Resource URI"] = [config.repositoryDomain + "/datastream/" + metadataObject["Resource URI"] + "/object"];
	}
}