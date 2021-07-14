'use strict';

const es = require('../config/index'),
      config = require('../config/config'),
      nodemailer = require('nodemailer'),
      templates = require("./templates/download.js");

exports.validateMasterKey = function(key) {
	return key == config.apiKey ? true : false;
}

exports.getMasterKey = function() {
	let key = config.apiKey || "";
	return key.length > 0 ? key : null;
}

exports.sendApiKeyEmail = function(address, key, callback) {
	var transporter = nodemailer.createTransport({
	  	host: config.mailServer,
    	port: config.mailServerPort
	});

	var message = "Api key: " + key;
	var mailOptions = {
		from: 'donotreply@example.com',
		to: address,
		subject: 'Collections as Data API key request',
		text: message
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log("Email error: " + error);
			callback(error, null);
		} else {
			console.log("Email sent: " + address + ": " + info.response);
			callback(null, info.response);
		}
	});
}

exports.fetchTemplate = function(templateName) {
	let template = templates[templateName] || "Template " + templateName + " not found";
	return template;
}