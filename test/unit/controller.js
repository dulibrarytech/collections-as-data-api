'use strict';

const config = require('../../config/config.js'),
	Service = require('./service');

exports.test_all = function(req, res) {
	Service.runLibraryTests();
	res.send("Ok");
}