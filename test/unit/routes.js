const config = require('../../config/config.js'),
 		User = require('../../user/controller'),
		Test = require('./controller');

module.exports = function (app) {
	if(config.nodeEnv == "development") {
	    app.route('/test/all')
	    	.get(Test.test_all)
	}
};