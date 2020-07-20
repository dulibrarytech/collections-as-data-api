'use strict';
 
const config = require('../config/config'),
	  Service = require('./service');

exports.renderForm = function(req, res) {
	let data = {
		"root_url": config.rootUrl
	};
	res.render('cad-api-form', data);
}

exports.getTemplate = function(req, res) {
	let name = req.params.name || "",
		template = "";

	template = Service.fetchTemplate(name);
	res.send(template);
}