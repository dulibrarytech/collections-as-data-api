'use strict'

const config = require('../config/config');

exports.getItemMetadataValues = function(item, data = {}) {
	let displayRecord = item.display_record || {},
		metadataFields = config.itemMetadataFields || {},
		values = [],
		pathArray;

	for(var key in metadataFields) {
		values = [];
		pathArray = metadataFields[key].path.split(".") || [];
		extractValues(pathArray, displayRecord, metadataFields[key].matchField || null, metadataFields[key].matchValue || null, metadataFields[key].condition || "true", values);
		if(values.length > 0) {
			data[key] = values;
		}
	}

	return data;
}

/*
 * 
 */
var extractValues = function(pathArray, object, matchField, matchValue, condition, bucket) {
	var nextKey,
		nextObject,
		nextArray;

	// We have drilled into the specified field.  Locate the value
	if(pathArray.length == 1) {
		if(matchField) {
			if(object[pathArray] && 
				condition == "true" && 
				object[matchField] == matchValue) {

				if(bucket.includes(object[pathArray]) === false && object[pathArray].length > 0) {
					bucket.push(object[pathArray]);
				}
			}
			else if(object[pathArray] && 
					condition == "false" && 
					object[matchField] != matchValue) {

				if(bucket.includes(object[pathArray]) === false && object[pathArray].length > 0) {
					bucket.push(object[pathArray]);
				}
			}
		}
		else if(object[pathArray]) {

			if(bucket.includes(object[pathArray]) === false && object[pathArray].length > 0) {
				bucket.push(object[pathArray]);
			}
		}
	}

	// Keep digging
	else {
		nextArray = pathArray.slice();
		nextKey = nextArray.shift();
		nextObject = object[nextKey];

		if(!nextObject) {
			return 0;
		}
		else if(nextObject.length) {
			for(var index in nextObject) {
				extractValues(nextArray, nextObject[index], matchField, matchValue, condition, bucket);
			}
		}
		else {
			extractValues(nextArray, nextObject, matchField, matchValue, condition, bucket);
		}
	}
}
exports.extractValues = extractValues;