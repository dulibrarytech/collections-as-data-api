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

var config = require("../config/config.js"),
	Model = require("./model"),
	Keys = require("../libs/keys.js");

var validateKey = async function(key, req=null) {
	let isValid = false;
	if(key.length % 2 == 0) {
		try {
			let encKey = Keys.encryptString(key, "hex", "hex"),
					userId = await Model.findUserByKey(encKey);

			if(userId) {
				let route = req ? req.originalUrl.substring(0,req.originalUrl.indexOf("?")) : "route unavailable";
				console.log("User access:", Keys.decryptString(userId, "hex", "utf8"), "Route:", route);
				isValid = true;
			}
		}
		catch(e) {
			console.log("Error validating key: ", error);
		}
	}

	return isValid;
}

var addUser = async function(email) {
	console.log(`User request for api key, email address: ${email}`)
	let key = null;

	try {
		// Gen key
		let newKey = Keys.createApiKey();
		let encKey = Keys.encryptString(newKey, "hex", "hex");
		let encEmail = Keys.encryptString(email, "utf8", "hex");
		let dbRecord = await Model.createUserRecord(encEmail, encKey);
		console.log(`User added. New key is: ${newKey}, database id is: ${dbRecord}`)
		if(dbRecord) {
			key = newKey;
		}
	}
	catch(e) {
		console.log("Error adding user: ", error);
	}

	return key;
}

module.exports = {
	validateKey,
	addUser
}