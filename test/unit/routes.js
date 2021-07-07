const config = require('../../config/config.js'),
		Test = require('./controller');

module.exports = function (app) {

	if(config.nodeEnv == "development") {
		// app.route('/test')
	 //        .get(Test.test_view)

	    app.route('/test/all')
	    	.get(Test.test_all)
	}
};