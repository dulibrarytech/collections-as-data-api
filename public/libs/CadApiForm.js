'use strict'

var CadApiForm = (function() {
		
	var initForm;
	var onSelectEndpointOption;
	var submitGetRequest;

	var getUri;
	var doAjax;
	var resetDisplays;

	var config;

	initForm = function(configObject) {
		config = configObject;
		resetDisplays();

		var endpoint,
			option,
		    select = document.getElementById("endpoint-select");

		// Add an option to the dropdoen for each endpoint
		for(var index in config.apiFormEndpoints) {
			endpoint = config.apiFormEndpoints[index];
			
			option = document.createElement("OPTION");
			option.innerHTML = endpoint.label || "No label";
			select.appendChild(option);
		}
	}

	onSelectEndpointOption = function(option) {
		let endpoint = option.value;
		resetDisplays();
		console.log("onSelectEndpointOption", option.value)
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

	getUri = function(uri, params) {

	}

	doAjax = function(uri, callback) {
		// callback();
	}

	resetDisplays = function() {
		document.getElementById("query-display").innerHTML = "";
	}

	return {
		initForm: function(configObject) {
			return initForm(configObject);
		},
		onSelectEndpointOption: function(option) {
			return onSelectEndpointOption(option);
		},
		submitGetRequest: function() {
			return submitGetRequest();
		}
	}
})()