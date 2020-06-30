'use strict'

var CadApiForm = (function() {
		
	var initForm;
	var onSelectEndpointOption;
	var submitGetRequest;
	var onSelectParam;

	var getUri;
	var ajaxRequest;
	var resetDisplays;
	var resetUriParam;

	var config;

	initForm = function(configObject) {
		var endpoint,
			option,
		    select = document.getElementById("endpoint-select");

		// Set global config object
		config = configObject;
		resetDisplays();

		// Add an option to the select box for each endpoint
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
		let endpoint = config.apiFormEndpoints[endpointId];
		document.getElementById("query-display").value = endpoint.uri;

		// Display the first parameter select box
		if(endpoint.params && endpoint.params.length > 0) {
			for(var param of endpoint.params) {
				// this is the first parameter
				if(param.depends_on == null) {
					// Create a select box
					let formGroup = document.createElement("DIV");
					formGroup.classList.add("form-group");
					formGroup.classList.add("param-select");
					let select = document.createElement("SELECT");
					select.setAttribute("id", param.param_id + "_select")
					select.classList.add("form-control");
					select.setAttribute("onmousedown", "CadApiForm.resetUriParam(this)");
					select.setAttribute("onchange", "CadApiForm.onSelectParam(this)");
					select.setAttribute("placeholder", "sel");
					formGroup.appendChild(select);
					document.getElementsByClassName("api-form-section")[0].appendChild(formGroup);

					// Get data for box
					let url = config.apiDomain + param.data;
					ajaxRequest("get", url, function(error, status, response) {
						if(error) {
							console.log(error);
						}
						else {
							let responseObject = JSON.parse(response),
								map = param.option_map, option, item;

							// Create placeholder text
							option = document.createElement("OPTION");
							option.setAttribute("value", "");
							option.innerHTML = "Select a Collection";
							select.appendChild(option);

							// Add an option for each item in the response
							for(var index in responseObject.data) {
								item = responseObject.data[index];
								option = document.createElement("OPTION");
								option.setAttribute("value", item[map.value]);
								option.innerHTML = item[map.text];
								select.appendChild(option);
							}
						}
					});
				}
			} 
		}
	}

	submitGetRequest = function() {
		let uri = document.getElementById("query-display").value;
		let url = config.apiDomain + uri;
		ajaxRequest("get", url, function(error, status, response) {
			if(error) {
				console.log(error);
			}
			else {
				let responseObject = JSON.parse(response);
		       	let data = responseObject.data || {};
		       	document.getElementById("query-response-display").value = JSON.stringify(data, undefined, 4);
			}
		});
	}

	resetUriParam = function(selectBox) {
		// Replace the param value in the query uri with the brace delimited param name
		let paramName = selectBox.id.replace("_select", "");
		let param = "{" + paramName + "}";
		if(selectBox.value) {	
			document.getElementById("query-display").value = document.getElementById("query-display").value.replace(selectBox.value, param);
		}
	}

	onSelectParam = function(selectBox) {
		// Replace the brace delimited param name in the query uri with the selected param value
		document.getElementById("query-response-display").value = "";
		let queryString = document.getElementById("query-display").value;
		let param = "{" + selectBox.id.replace("_select", "") + "}";
		queryString = queryString.replace(param, selectBox.value);
		document.getElementById("query-display").value = queryString;
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
		document.getElementById("query-display").value = "";
		document.getElementById("query-response-display").value = "";
		let paramSelects = document.getElementsByClassName("param-select");
		for(var i=0; i<paramSelects.length; i++) {
			paramSelects[i].remove();
		}
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
		},
		resetUriParam: function(selectBox) {
			return resetUriParam(selectBox);
		},
		onSelectParam: function(selectBox) {
			return onSelectParam(selectBox);
		}
	}
})()