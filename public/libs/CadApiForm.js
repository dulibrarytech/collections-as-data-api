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
	var clearDependentParams;

	var config;
	var cache = {};

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
					if(!document.getElementById(param.name + "_select")) {
						console.log("TEST creating select box for", param)
						let formGroup = document.createElement("DIV");
						formGroup.classList.add("form-group");
						formGroup.classList.add("param-select");
						let select = document.createElement("SELECT");
						select.setAttribute("id", param.name + "_select")
						select.classList.add("form-control");
						//select.setAttribute("onmousedown", "CadApiForm.resetUriParam(this)");
						select.setAttribute("onchange", "CadApiForm.onSelectParam(this)");
						formGroup.appendChild(select);
						//document.getElementsByClassName("api-form-section")[0].appendChild(formGroup);
						document.getElementById("param-options").appendChild(formGroup);
							console.log("TEST Aparam is", param)
						// Get data for box
						let url = config.apiDomain + param.data;
						ajaxRequest("get", url, function(error, status, response) {
							if(error) {
								console.log(error);
							}
							else {
									console.log("TEST ajax response Bparam is", param)
								let responseObject = JSON.parse(response),
									map = param.option_map, option, item;

								// Create placeholder text
								option = document.createElement("OPTION");
								option.setAttribute("value", "");
									console.log("TEST Cparam is", param)
									console.log("TEST label is", param.label)
								option.innerHTML = param.label;
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
	}

	submitGetRequest = function() {
		let uri = document.getElementById("query-display").value,
		 	url = config.apiDomain + uri;
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
			console.log("TEST reset uri param")
		// Replace the param value in the query uri with the brace delimited param name
		let paramName = selectBox.id.replace("_select", "");
		console.log("TEST param cache", cache[paramName])
		let param = "{" + paramName + "}";
		if(selectBox.value) {	
			document.getElementById("query-display").value = document.getElementById("query-display").value.replace(cache[paramName], param);
		}
	}

	onSelectParam = function(selectBox) {
		resetUriParam(selectBox);
		// Replace the brace delimited param name in the query uri with the selected param value
		document.getElementById("query-response-display").value = "";
		let paramName = selectBox.id.replace("_select", ""),
			queryString = document.getElementById("query-display").value,
			paramPlaceholder = "{" + paramName + "}";
		queryString = queryString.replace(paramPlaceholder, selectBox.value);
		document.getElementById("query-display").value = queryString;
		cache[paramName] = selectBox.value;
		clearDependentParams(selectBox);

		// Check for a dependant param
		let endpointId = document.getElementById("endpoint-select").value, param;
		for(var index in config.apiFormEndpoints[endpointId].params) {
			param = config.apiFormEndpoints[endpointId].params[index];
			if(param.depends_on == paramName) {
				// Insert a select box (TODO func add ParamSelectBox(param)
				let formGroup = document.createElement("DIV");
				formGroup.classList.add("form-group");
				formGroup.classList.add("param-select");
				let select = document.createElement("SELECT");
				select.setAttribute("id", param.name + "_select")
				select.classList.add("form-control");
				//select.setAttribute("onmousedown", "CadApiForm.resetUriParam(this)");
				select.setAttribute("onchange", "CadApiForm.onSelectParam(this)");
				formGroup.appendChild(select);
				//document.getElementsByClassName("api-form-section")[0].appendChild(formGroup);
				document.getElementById("param-options").appendChild(formGroup);
				// Use data uri to fetch data for the select, add options for each response item
				// Get data for box TODO func populateParamSelectBox(param)
				let url = config.apiDomain + param.data,
					paramPlaceholder = "{" + paramName + "}";
					url = url.replace(paramPlaceholder, selectBox.value);

					console.log("TEST ajax url", url);
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
						option.innerHTML = param.label;
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
				// Add id=param id (match param name)	
				console.log("TEST found dependent param", config.apiFormEndpoints[endpointId].params[index])	

			}
		}
		console.log("TEST cur endpoint id", document.getElementById("endpoint-select").value, paramName);
	}

	clearDependentParams = function(selectBox) {
		while(selectBox.parentNode.nextSibling) {
			console.log("TEST removing sibling", selectBox.parentNode.nextSibling.firstChild.value.length)
			if(selectBox.parentNode.nextSibling.firstChild.value.length > 0) {
				let paramPlaceholder = "{" + selectBox.parentNode.nextSibling.firstChild.id.replace("_select", "") + "}";
				console.log("TEST appendstring pre", document.getElementById("query-display").value)
				document.getElementById("query-display").value = document.getElementById("query-display").value.replace(selectBox.parentNode.nextSibling.firstChild.value, paramPlaceholder)
				console.log("TEST appendstring post", document.getElementById("query-display").value)
			}
			selectBox.parentNode.nextSibling.remove();
		}
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
		xhttp.open(type, url, false);
		xhttp.send();
	}

	resetDisplays = function() {
			console.log("TEST reset");
		document.getElementById("query-display").value = "";
		document.getElementById("query-response-display").value = "";
		document.getElementById("param-options").innerHTML = "";
		// let paramSelects = document.getElementsByClassName("param-select");
		// for(var i=0; i<paramSelects.length; i++) {
		// 	console.log("TEST removing", paramSelects[i])
		// 	paramSelects[i].remove();
		// }
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