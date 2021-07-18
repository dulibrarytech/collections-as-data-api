'use strict';
 
const config = require('../config/config'),
	  Service = require('./service'),
	  UserService = require('../user/service.js')

exports.validateKey = async function(req, res) {
	let isValid = await UserService.validateKey(req.query.key || "", req);
	res.send({isValid:isValid})
}

exports.requestApiKey = async function(req, res) {
	let email = req.body.email || "",
		response = false;

	if(email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm)) {
		let apikey = await UserService.addUser(email);
		if(apikey) {
			Service.sendApiKeyEmail(email, apikey, function(error, response) {
				if(error) { 
					console.log("Error: ", error);
					res.status(500);
				}
				else {
					res.status(200);
				}
				res.send();
			});
		}
		else {
			res.status(500).send({ error: "Error adding user, can not create api key" });
		}
	}
	else {
		res.status(400).send({ error: "Invalid email address" });
	}
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

exports.renderTermsOfUse = function(req, res) {
	let data = {
		"root_url": config.rootUrl
	};
	res.render('terms-of-use', data);
}