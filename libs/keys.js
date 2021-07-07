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

exports.createApiKey = function() {
	var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryption_key), Buffer.from(initialization_vector))
	var newKey = cipher.update(crypto.randomBytes(8), 'utf8', 'hex')
	newKey += cipher.final('hex')
	return newKey;
}

exports.encryptHex = function(hexString) {
	var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryption_key), Buffer.from(initialization_vector))
	var encrypted = cipher.update(hexString, 'hex', 'hex')
	encrypted += cipher.final('hex')
	return encrypted;
}

exports.decryptHex = function(hexString) {
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryption_key), Buffer.from(initialization_vector))
  	let decrypted = decipher.update(hexString, 'hex', 'hex')
  	decrypted += decipher.final('hex')
  	return decrypted;
}

exports.encryptString = function(string) {
	var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryption_key), Buffer.from(initialization_vector))
	var encrypted = cipher.update(string, 'utf8', 'hex')
	encrypted += cipher.final('hex')
	return encrypted;
}

exports.decryptString = function(string) {
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryption_key), Buffer.from(initialization_vector))
  	let decrypted = decipher.update(string, 'hex', 'utf8')
  	decrypted += decipher.final('utf8')
  	return decrypted;
}

