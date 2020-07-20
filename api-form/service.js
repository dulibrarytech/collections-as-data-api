'use strict';

const es = require('../config/index'),
      config = require('../config/config'),
      pythonTemplates = require("./templates/python.js");

exports.fetchTemplate = function(templateName) {
	let template = pythonTemplates[templateName] || "Template " + templateName + " not found";
		console.log("TEST template", template)
	return template;
}