'use strict';

const config = require('../../config/config.js'),
	UserModel = require('../../user/model.js'),
	Keys = require('../../libs/keys.js');

exports.runLibraryTests = function() {
	console.log(test_keys_createApiKey() ? "Pass" : "Fail");
	console.log(test_keys_encryptString() ? "Pass" : "Fail");
	console.log(test_keys_decryptString() ? "Pass" : "Fail");
}

exports.runDatabaseTests = async function() {
	console.log(await test_database_findUserByKey() ? "Pass" : "Fail");
	console.log(await test_database_createUserRecord() ? "Pass." : "Fail");
}

var test_keys_createApiKey = function() {
	console.log("test_keys_createApiKey:")
	let result = true;
	try {
		let key = Keys.createApiKey();
		console.log("Key:", key)
	}
	catch(e) {
		console.log(e);
		result = false;
	}
	return result;
}

var test_keys_encryptString = function() {
	console.log("test_keys_encryptString:")
	let result = true;
	try {
		let key = "25a36b8423939460d76a5481522a16ba";
		console.log(`Test hex string: ${key}`)
		let encrypted = Keys.encryptString(key, 'hex', 'hex');
		console.log(`Result value: ${encrypted}`);
		console.log("Expected value: 31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd");
		if(encrypted != "31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd") {throw "Encrypted value is not as expected"}

		let string = "test@example.com";
		console.log(`Test string: ${string}`)
		encrypted = Keys.encryptString(string, 'utf8', 'hex');
		console.log(`Result value: ${encrypted}`);
		console.log("Expected value: 156ecfa364a567f9b073b2b7d69eea30564ea8edbb83e842a743aa1d17215f44");
		if(encrypted != "156ecfa364a567f9b073b2b7d69eea30564ea8edbb83e842a743aa1d17215f44") {throw "Encrypted value is not as expected"}
	}
	catch(e) {
		console.log(e);
		result = false;
	}
	return result;
}

var test_keys_decryptString = function() {
	console.log("test_keys_decryptString:")
	let result = true;
	try {
		let encrypted = "31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd";
		console.log(`Test encrypted hex value: ${encrypted}`)
		let decrypted = Keys.decryptString(encrypted, 'hex', 'hex');
		console.log(`Result value: ${decrypted}`);
		console.log("Expected value: 25a36b8423939460d76a5481522a16ba");
		if(decrypted != "25a36b8423939460d76a5481522a16ba") {throw "Decrypted value is not as expected"}

		encrypted = "156ecfa364a567f9b073b2b7d69eea30564ea8edbb83e842a743aa1d17215f44";
		console.log(`Test encrypted string: ${encrypted}`)
		decrypted = Keys.decryptString(encrypted, 'hex', 'utf8');
		console.log(`Result value: ${decrypted}`);
		console.log("Expected value: test@example.com");
		if(decrypted != "test@example.com") {throw "Decrypted value is not as expected"}
	}
	catch(e) {
		console.log("Exception caught:", e);
		result = false;
	}
	return result;
}

var test_database_findUserByKey = async function() {
	console.log("test_database_findUserByKey:")
	let result = true;

	try {
		let user = await UserModel.findUserByKey("31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd");
		if(user) {
			console.log("test_database_findUserByKey Database response:", user);
		}
		else {
			console.log("Database error");
			result = false;
		}
	}
	catch(e) {
		console.log("Exception caught:", e);
		result = false;
	}

	return result;
}

var test_database_createUserRecord = async function() {
	console.log("test_database_createUserRecord:")
	let result = true;

	try {
		let user = await UserModel.createUserRecord("test.example.com", "testkey");
		if(user) {
			console.log("test_database_createUserRecord Database response:", user);
		}
		else {
			console.log("Database error");
			result = false;
		}
	}
	catch(e) {
		console.log("Exception caught:", e);
		result = false;
	}
	console.log("C", result)
	return result;
}