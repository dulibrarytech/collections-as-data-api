'use strict'

var CadApiForm = (function() {
		
	var initForm;
	var onCheckTerms;
	var onSelectEndpointOption;
	var submitGetRequest;
	var submitEmailAddress;
	var setApiKey;
	var onSelectParam;
	var onCheckParam;

	var ajaxRequest;
	var resetDisplays;
	var resetForm;
	var refreshQueryDisplay;
	var resetUriParam;
	var clearDependentParams;
	var addParameterSelectBox;
	var getUrlParamValues;
	var displayTemplate;
	var renderTemplate;

	var config;
	var cache;
	var apiKey;

	initForm = function(configObject) {
		var endpoint,
			option,
		    select = document.getElementById("endpoint-select");

		config = configObject;
		cache = {};
		apiKey = "";
		resetDisplays();

		// Add an option to the select box for each endpoint
		for(var index in config.apiFormEndpoints) {
			endpoint = config.apiFormEndpoints[index];
			option = document.createElement("OPTION");
			option.setAttribute("value",  index);
			option.innerHTML = endpoint.label || "No label";
			select.appendChild(option);
		}
	}

	onCheckTerms = function(checkbox) {
		if(checkbox.checked) {
			document.getElementById("endpoint-select").classList.remove("disabled");
			document.getElementById("get-submit").classList.remove("disabled");
			document.getElementById("query-display").classList.remove("disabled");
		}
		else {
			document.getElementById("endpoint-select").classList.add("disabled");
			document.getElementById("get-submit").classList.add("disabled");
			document.getElementById("query-display").classList.add("disabled");
			resetForm();
		}
	}

	displayTemplate = function(endpointId) {
		let templates = config.apiFormEndpoints[endpointId].templates || {}, url;
		for(var key in templates) {
			document.getElementById(key + "-display").innerHTML = "";
			url = config.apiDomain + "/template/" + templates[key] + "?key=" + apiKey;
			ajaxRequest("get", url, function(error, status, response) {
				if(error) {
					console.log(error);
				}
				else {
					document.getElementById(key + "-display").innerHTML = renderTemplate(response, cache);
				}
			});
		} 
	}

	onSelectEndpointOption = function(endpointId) {
		cache = {
			collectionId: "",
			itemId: []
		};
		resetDisplays();
		let endpoint = config.apiFormEndpoints[endpointId];
		document.getElementById("endpoint-select").value = endpointId;
		document.getElementById("query-display").value = config.apiDomain + endpoint.uri;

		// Display the first parameter select box
		if(endpoint.params && endpoint.params.length > 0) {
			for(var param of endpoint.params) {
				// this is the first parameter
				if(param.depends_on == null) {
					addParameterSelectBox(param);
				}
			} 
		}
	}

	submitGetRequest = function() {
		let uris = document.getElementById("query-display").value.split("\n\n"), 
			urls = [];

		for(var uri of uris) {
			if(uri.length > 0) {
				urls.push(uri);
			}
		}

		document.getElementById("query-response-display").value = "";

		// Loop urls, fetch
		let endchar = "", paramData;
		for(var url of urls) {
			url += "?key=" + apiKey;
			ajaxRequest("get", url, function(error, status, response) {
				if(error && status != 0) {
					console.log(error);
					document.getElementById("query-response-display").value = ("HTTP Status: " + status + "\nError: " + error);
				}
				else if(status != 200 && status != 0) {
					document.getElementById("query-response-display").value = ("HTTP Status:" + status);
				}
				else if(response) {
					let responseObject = JSON.parse(response),
			       		data = responseObject.data || {};

			       	// Insert multiple response objects into a JSON array structure in the output display
			       	let displayData = document.getElementById("query-response-display").value;
			       	if(cache[cache.currentParam] && typeof cache[cache.currentParam] == "object") {
			       		// This is a multi request output. Display output data in a JSON array. Prepend a '[' to the first data output, append a ',' to delimit the response objects, append a ']' to the last response received
				       	if(displayData.length == 0) {
				       		document.getElementById("query-response-display").value = "[";
				       	}
				       	// If the number of delimiters is equal to the number of params currently selected, this is the last response object to be added to the display.
				       	if(displayData.indexOf(",\n\n") >= 0 && displayData.match(/\n\n/g).length == cache[cache.currentParam].length-1) {
				       		endchar = "]";
				       	}	
				       	else {
				       		endchar = ",\n\n";
				       	}
			       	}
			       	document.getElementById("query-response-display").value += (JSON.stringify(data, undefined, 4)) + endchar;
				}
			});
		}
	}

	submitEmailAddress = function() {
		let address = document.getElementById("email").value.substring(0, config.maxEmailChars),
			url = config.apiDomain + "/form/requestKey?email=" + address;

		if(address.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm)) {
			ajaxRequest("post", url, function(error, status, response) {
				document.getElementById("email").style.color = "green";
				document.getElementById("email").value = "Request for API key sent.";
				setTimeout(function() { 
					document.getElementById("email").style.color = "inherit";
					document.getElementById("email").value = "";
					document.getElementById("email").placeholder = "Enter email to receive API key"; 
				}, 3000);

				if(error) {
					console.log("Error sending API key request:", error);
				}
				else if(response) {
					console.log("Request for API key sent successfully");
				}
				else {
					console.log("Error sending API key notification email")
				}
			});
		}
		else {
			document.getElementById("email").style.color = "red";
			document.getElementById("email").value = "Invalid email address";
		}
	}

	setApiKey = function() {
		let key = document.getElementById("api-key").value,
			url = config.apiDomain + "/form/validateKey?key=" + key;

		ajaxRequest("get", url, function(error, status, response) {
			if(error) {
				console.log(error);
			}
			else {
				response = JSON.parse(response);
				if(response.isValid) {
					console.log("Key is valid");
					apiKey = key;
					document.getElementById("terms-ack").style.display = "flex";
					resetForm();
					document.getElementById("api-key-feedback").style.display = "block";
					document.getElementById("api-key").disabled = true;
					document.getElementById("api-key-set").disabled = true;
				}
				else {
					console.log("Invalid key");
					document.getElementById("api-key").style.color = "red";
					document.getElementById("api-key").value = "Invalid key";
					document.getElementById("api-key-feedback").style.display = "none";
				}
			}
		});
	}

	renderTemplate = function(template, values) {
		let name, 
			value = "Unset",
			params = template.match(/{(.*?)\}/g) || [];

		for(var param of params) {
			name = param.replace("{", "").replace("}", "");
			if(cache[name]) {
				value = JSON.stringify(cache[name]);
				template = template.replace(param, value);
			}
			else {
				template = template.replace(param, "");
			}
		}

		return template;
	}

	resetUriParam = function(paramName) {
		let endpointId = document.getElementById("endpoint-select").value;
		if(cache[paramName]) {
			delete cache[paramName];
		}
		document.getElementById("query-display").value = getUrlParamValues(config.apiDomain + config.apiFormEndpoints[endpointId].uri);
	}

	onSelectParam = function(selectBox) {
		let paramName = selectBox.id.replace("_select", "")
		clearDependentParams(selectBox);
		document.getElementById("query-response-display").value = "";
		cache[paramName] = selectBox.value;
		cache.currentParam = paramName;
		refreshQueryDisplay();

		// Check for a dependent param
		let endpointId = document.getElementById("endpoint-select").value, param;
		if(config.apiFormEndpoints[endpointId].params) {
			for(var index in config.apiFormEndpoints[endpointId].params) {
				param = config.apiFormEndpoints[endpointId].params[index];
				if(param.depends_on == paramName) {
					addParameterSelectBox(param);
				}
			}
		}
		displayTemplate(endpointId);
	}

	onCheckParam = function(checkBox) {
		let endpointId = document.getElementById("endpoint-select").value,
			uri = config.apiDomain + config.apiFormEndpoints[endpointId].uri,
			paramName = checkBox.name;

		cache.currentParam = paramName;
		uri = uri.replace("{" + paramName + "}", checkBox.value) + "\n\n";
		uri = getUrlParamValues(uri);
		document.getElementById("query-response-display").value = "";

		if(checkBox.checked) {
			if(!cache[paramName] || typeof cache[paramName] == "string") {
				cache[paramName] = [];
			}
			cache[paramName].push(checkBox.value);

			if(document.getElementById("query-display").value.indexOf("{" + paramName + "}") >= 0) {
				document.getElementById("query-display").value = "";
			}
			document.getElementById("query-display").value += uri;
		}	
		else {
			// Remove string from cache array
			if(cache[paramName] && typeof cache[paramName] == "object") {
				let paramValues = cache[paramName] || [];
				cache[paramName].splice(paramValues.indexOf(checkBox.value),1)
			}

			// Replace uri in qdispl string with ""
			document.getElementById("query-display").value = document.getElementById("query-display").value.replace(uri, "");
			if(document.getElementById("query-display").value.length == 0) {
				refreshQueryDisplay();
			}
		}	
		displayTemplate(endpointId);
	}

	addParameterSelectBox = function(param) {
		if(!document.getElementById(param.name + "_select")) {
			let formGroup = document.createElement("DIV");
			formGroup.classList.add("form-group");
			formGroup.classList.add("param-select");

			let url = config.apiDomain + getUrlParamValues(param.data) + "?key=" + apiKey;
			ajaxRequest("get", url, function(error, status, response) {
				if(error) {
					console.log(error);
				}
				else {
					let responseObject = JSON.parse(response),
						map = param.option_map;

					if(param.multi_select) {
						// Populate with checkboxes (onclick onCheckParam(checkBox))
						let container = document.createElement("DIV");
						container.classList.add("list-container");
						container.classList.add("form-control");
						let list = document.createElement("UL"), listItem, checkbox, label, item;
						list.setAttribute("id", param.name + "_select");

						// Add the response items
						for(var index in responseObject.data) {
							if(!param.required_field ||
							   (param.required_field && responseObject.data[index][param.required_field])) {

								item = responseObject.data[index];
								listItem = document.createElement("LI");
								checkbox = document.createElement("INPUT");
								checkbox.setAttribute("type", "checkbox");
								checkbox.setAttribute("onclick", "CadApiForm.onCheckParam(this)");
								checkbox.setAttribute("name", param.name);
								checkbox.setAttribute("value", item[map.value]);
								label = document.createElement("LABEL");
								label.innerHTML = item[map.text];
								listItem.appendChild(checkbox);
								listItem.appendChild(label);
								list.appendChild(listItem);
							} 
						}

						container.appendChild(list);
						formGroup.appendChild(container);
						document.getElementById("param-options").appendChild(formGroup);
					}
					else {
						// Add select box
						let select = document.createElement("SELECT"), option, item;
						select.setAttribute("id", param.name + "_select")
						select.classList.add("form-control");
						select.setAttribute("onchange", "CadApiForm.onSelectParam(this)");
						formGroup.appendChild(select);
						document.getElementById("param-options").appendChild(formGroup);

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
				}
			});
		}
	}

	getUrlParamValues = function(url) {
		let params = url.match(/{(.*?)\}/g), paramName;
		if(params) {
			for(var param of params) {
				paramName = param.replace("{", "").replace("}", "");
				if(cache[paramName] && typeof cache[paramName] == "string") {
					url = url.replace(param, cache[paramName]);
				}
			}
		}
		return url;
	}

	clearDependentParams = function(selectBox) {
		document.getElementById("query-display").value = getUrlParamValues(document.getElementById("query-display").value);
		while(selectBox.parentNode.nextSibling) {
			if(selectBox.parentNode.nextSibling.firstChild.value && selectBox.parentNode.nextSibling.firstChild.value.length > 0) {
				let paramName = selectBox.parentNode.nextSibling.firstChild.id.replace("_select", "");
				let paramPlaceholder = "{" + paramName + "}";
				resetUriParam(paramName);
				document.getElementById("query-display").value = document.getElementById("query-display").value.replace(selectBox.parentNode.nextSibling.firstChild.value, paramPlaceholder)
			}
			selectBox.parentNode.nextSibling.remove();
		}
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

		if(type.toLowerCase() == "post") {
			let param = url.substring(url.indexOf("?")+1).split("="),
				data = {};

			data[param[0]] = param[1];
			url = url.substring(0, url.indexOf("?"));
			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-type", "application/json");
			xhttp.send(JSON.stringify(data));
		}
		else {
			xhttp.open("GET", url, false);
			xhttp.send();
		}
	}

	resetDisplays = function() {
		document.getElementById("query-display").value = "";
		document.getElementById("query-response-display").value = "";
		document.getElementById("param-options").innerHTML = "";
		var codeDisplays = document.getElementsByClassName("code-display");
		for(var i=0; i<codeDisplays.length; i++) {
			codeDisplays[i].innerHTML = "";
		}
	}

	resetForm = function() {
		resetDisplays();
		onSelectEndpointOption(config.defaultEndpoint);
	}

	refreshQueryDisplay = function() {
		let endpointId = document.getElementById("endpoint-select").value;
		let uri = config.apiDomain + config.apiFormEndpoints[endpointId].uri;
		document.getElementById("query-display").value = getUrlParamValues(uri);
	}

	return {
		initForm: function(configObject) {
			initForm(configObject);
		},
		onCheckTerms: function(checkBox) {
			onCheckTerms(checkBox);
		},
		onSelectEndpointOption: function(endpointId) {
			onSelectEndpointOption(endpointId);
		},
		submitGetRequest: function() {
			submitGetRequest();
		},
		submitEmailAddress: function() {
			submitEmailAddress();
		},
		setApiKey: function() {
			setApiKey();
		},
		resetUriParam: function(paramName) {
			resetUriParam(paramName);
		},
		onSelectParam: function(selectBox) {
			onSelectParam(selectBox);
		},
		onCheckParam: function(checkBox) {
			onCheckParam(checkBox);
		}
	}
})()