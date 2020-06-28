'use strict';
 
const  	config = require('../config/config');

exports.renderForm = function(req, res) {
	let data = {};
	res.render('cad-api-form', data);
}