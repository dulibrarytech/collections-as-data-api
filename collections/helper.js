'use strict'

const config = require("../config/config");

exports.addMetadataAttributes = function(metadata) {
	var updated = {};
	for(var key in metadata) {
		updated[key] = {
			label: key,
			value: metadata[key]
		}
	}
	return updated;
}