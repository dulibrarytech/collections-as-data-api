'use strict';
 
const config = require('../config/config'),
	  Service = require('./service');

exports.validateKey = function(req, res) {
	let isValid = Service.validateKey(req.query.key || "");
	res.send({isValid:isValid})
}

exports.sendApiKeyEmail = function(req, res) {
	let email = req.body.email || "",
		response = false;
	Service.sendApiKeyEmail(email, Service.getKey(), function(error, response) {
		if(error) { 
			console.log("Error: ", error) 
		}
		else {
			response = true;
		}
		res.send(response);
	});
}

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