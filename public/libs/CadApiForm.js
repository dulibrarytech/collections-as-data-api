'use strict'

var CadApiForm = (function() {

	var initForm;
	var submitGetRequest;
	var onSelectEndpointOption;
	var getUri;
	var doAjax;

	initForm = function(uriId) {
		// Get uri option label list from config, populate dropdown, using config default uriId. (config is {uriId: friendlyLabel}). option value is friendlyLabel, id is {uriId}_endpoint-option 
		// Clear query gen
		// Clear query response
		// Clear python window
	}

	submitGetRequest = function() {
		console.log("submitGetRequest");
		// Get element of class 'endpoint-option__active' (is an option element)
		// Get id
		// Remove '_endpoint-option' from id (is now uri id ie 'collections' or 'collection-items')
		// Get uri from input box
		// Switch on uri id 
		// get params, per config
		// Pass uri to get function below
	}

	onSelectEndpointOption = function(option) {
		let endpoint = option.value;
		console.log("onSelectEndpointOption", option.value)
	}

	getUri = function(uri, params) {

	}

	doAjax = function(uri, callback) {
		// callback();
	}

	return {
		initForm: function(uriId) {
			return initForm(uriId);
		},
		onSelectEndpointOption: function(option) {
			return onSelectEndpointOption(option);
		},
		submitGetRequest: function() {
			return submitGetRequest();
		}
	}
})()