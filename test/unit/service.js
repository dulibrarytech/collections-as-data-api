'use strict';

const config = require('../../config/config.js'),
	Keys = require('../../libs/keys.js');

exports.runLibraryTests = function() {
	if(true) {
		console.log(test_keys_createApiKey() ? "Pass" : "Fail");
		console.log(test_keys_encryptHex() ? "Pass" : "Fail");
		console.log(test_keys_decryptHex() ? "Pass" : "Fail");
		console.log(test_keys_encryptString() ? "Pass" : "Fail");
		console.log(test_keys_decryptString() ? "Pass" : "Fail");
	}
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

var test_keys_encryptHex = function() {
	console.log("test_keys_encryptHex:")
	let result = true;
	try {
		let key = "25a36b8423939460d76a5481522a16ba";
		console.log(`Key: ${key}`)
		let encrypted = Keys.encryptHex(key);
		console.log(`Result value: ${encrypted}`);
		console.log("Expected value: 31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd");
		if(encrypted != "31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd") {throw "Encrypted value is not as expected"}
	}
	catch(e) {
		console.log(e);
		result = false;
	}
	return result;
}

var test_keys_decryptHex = function() {
	console.log("test_keys_decryptHex:")
	let result = true;
	try {
		let encrypted = "31a5e8e07801680985a01b49d6c4dd768e3d59200fcd89b0c6f40efb418354fd";
		console.log(`Encrypted value: ${encrypted}`)
		let decrypted = Keys.decryptHex(encrypted);
		console.log(`Decrypted Key: ${decrypted}`);
		console.log("Expected value: 25a36b8423939460d76a5481522a16ba");
		if(decrypted != "25a36b8423939460d76a5481522a16ba") {throw "Decrypted value is not as expected"}
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
		let string = "test@example.com";
		console.log(`Test string: ${string}`)
		let encrypted = Keys.encryptString(string);
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
		let encrypted = "156ecfa364a567f9b073b2b7d69eea30564ea8edbb83e842a743aa1d17215f44";
		console.log(`Encrypted value: ${encrypted}`)
		let decrypted = Keys.decryptString(encrypted);
		console.log(`Decrypted Key: ${decrypted}`);
		console.log("Expected value: test@example.com");
		if(decrypted != "test@example.com") {throw "Decrypted value is not as expected"}
	}
	catch(e) {
		console.log(e);
		result = false;
	}
	return result;
}