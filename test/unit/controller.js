'use strict';

const config = require('../../config/config.js'),
	Service = require('./service');

exports.test_all = function(req, res) {
	if(false) {
		Service.runLibraryTests();
	}
	if(true) {
		Service.runDatabaseTests();
	}
	res.send("Ok");
}