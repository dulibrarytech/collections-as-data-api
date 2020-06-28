'use strict';
 
const config = require('../config/config');

exports.renderForm = function(req, res) {
	let data = {
		"root_url": config.rootUrl
	};
	res.render('cad-api-form', data);
}