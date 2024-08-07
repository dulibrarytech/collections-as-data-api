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

const cache = require("../libs/cache.js");

var findUserByKey = async function(key) {
	return new Promise(function(fulfill, reject) {
		let userEmail = cache.read(key);
		if(userEmail) fulfill(userEmail);
		else fulfill(null);
	});
}

var createUserRecord = async function(email, key) {
	return new Promise(function(fulfill, reject) {
		let created = cache.write(key, email)
		if(created) fulfill(true);
		else fulfill(null);
	});
}

module.exports = {
	findUserByKey,
	createUserRecord
}