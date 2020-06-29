'use strict'

var CadApiForm = (function() {
		
	var initForm;
	var onSelectEndpointOption;
	var submitGetRequest;

	var getUri;
	var ajaxRequest;
	var resetDisplays;

	var config;
	var activeId;

	initForm = function(configObject) {
		var endpoint,
			option,
		    select = document.getElementById("endpoint-select");

		// Set global config object
		config = configObject;
		resetDisplays();

		// Add an option to the dropdoen for each endpoint
		for(var index in config.apiFormEndpoints) {
			endpoint = config.apiFormEndpoints[index];
			option = document.createElement("OPTION");
			option.setAttribute("value",  index);
			option.innerHTML = endpoint.label || "No label";
			select.appendChild(option);
		}

		onSelectEndpointOption(config.defaultEndpoint);
	}

	onSelectEndpointOption = function(endpointId) {
		resetDisplays();
		console.log("onSelectEndpointOption", endpointId)
		let endpoint = config.apiFormEndpoints[endpointId]
		console.log("endpoint", endpoint)
		activeId = endpointId;
		document.getElementById("query-display").innerHTML = endpoint.uri;
	}

	submitGetRequest = function() {
		var endpoint = config.apiFormEndpoints[activeId];
		
		let url = config.apiDomain + endpoint.uri;
		ajaxRequest("get", url, function(error, status, response) {
			if(error) {
				console.log(error);
			}
			else {
				let responseObject = JSON.parse(response);
		       	let data = responseObject.data || {};
		       	document.getElementById("query-response-display").innerHTML = JSON.stringify(data, undefined, 4);
			}
		});
	}

	getUri = function(uri, params) {

	}

	ajaxRequest = function(type, url, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {		      
		       callback(null, 200, xhttp.responseText);
		    }
		    else {
		    	let message = "Server responded with status " + this.status + ", ready state " + this.readyState;
		    	callback(message, this.status, null)
		    }
		};
		xhttp.open(type, url, true);
		xhttp.send();
	}

	resetDisplays = function() {
		document.getElementById("query-display").innerHTML = "";
	}

	return {
		initForm: function(configObject) {
			return initForm(configObject);
		},
		onSelectEndpointOption: function(endpointId) {
			return onSelectEndpointOption(endpointId);
		},
		submitGetRequest: function() {
			return submitGetRequest();
		}
	}
})()