'use strict';

const es = require('../config/index'),
      config = require('../config/config'),
      templates = require("./templates/download.js");

exports.validateKey = function(key) {
	return key == config.apiKey ? true : false;
}

exports.fetchTemplate = function(templateName) {
	let template = templates[templateName] || "Template " + templateName + " not found";
	return template;
}