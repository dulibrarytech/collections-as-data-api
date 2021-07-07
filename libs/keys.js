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
	  crypto = require("crypto");

const encryption_key = config.encryptionKey;
const initialization_vector = config.encryptionInitVector;
const algorithm = "aes-256-cbc";

exports.createApiKey = function() {
	var cipher = crypto.createCipheriv(algorithm, Buffer.from(encryption_key), Buffer.from(initialization_vector))
	var newKey = cipher.update(crypto.randomBytes(8), 'utf8', 'hex')
	newKey += cipher.final('hex')
	return newKey;
}

exports.encryptString = function(string, inputFormat, outputFormat) {
	var cipher = crypto.createCipheriv(algorithm, Buffer.from(encryption_key), Buffer.from(initialization_vector))
	var encrypted = cipher.update(string, inputFormat, outputFormat)
	encrypted += cipher.final(outputFormat)
	return encrypted;
}

exports.decryptString = function(string, inputFormat, outputFormat) {
	const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryption_key), Buffer.from(initialization_vector))
  	let decrypted = decipher.update(string, inputFormat, outputFormat)
  	decrypted += decipher.final(outputFormat)
  	return decrypted;
}

