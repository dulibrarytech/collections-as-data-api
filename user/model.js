/**
 Copyright 2021 University of Denver
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

 'use strict'

const config = require("../config/config.js"),
	db = require("../libs/database.js").connection;
	
var findUserByKey = async function(key) {
	return new Promise(function(fulfill, reject) {
		db.query(`SELECT user_id FROM users AS id WHERE api_key='${key}'`, function (error, results, fields) {
	  	if (error) {
	  		console.log(`Mysql error: ${error}`);
	  		fulfill(null);
	  	}
	  	else {
	  		if(results.length > 0) {
	  			fulfill(results[0].user_id);
	  		}
	  		else {
	  			fulfill(null);
	  		}
	  	}
		});
	});
}

var createUserRecord = async function(email, key) {
	return new Promise(function(fulfill, reject) {
		db.query(`INSERT INTO users (user_id, api_key) VALUES ('${email}', '${key}')`, function (error, results, fields) {
	  	if (error) {
	  		console.log(`Mysql error: ${error}`);
	  		fulfill(null);
	  	}
	  	else {
	  		if(results.insertId) {
	  			fulfill(results.insertId);
	  		}
	  		else {
	  			fulfill(null);
	  		}
	  	}
		});
	});
}

module.exports = {
	findUserByKey,
	createUserRecord
}