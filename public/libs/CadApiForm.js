'use strict'

var CadApiForm = (function() {
		
	var initForm;
	var onSelectEndpointOption;
	var submitGetRequest;
	var onSelectParam;
	var onCheckParam;

	var ajaxRequest;
	var resetDisplays;
	var refreshQueryDisplay;
	var resetUriParam;
	var clearDependentParams;
	var addParameterSelectBox;
	var getUrlParamValues;

	var config;
	var cache;

	initForm = function(configObject) {
		var endpoint,
			option,
		    select = document.getElementById("endpoint-select");

		config = configObject;
		cache = {};
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
		cache = {};
		resetDisplays();
		let endpoint = config.apiFormEndpoints[endpointId];
		document.getElementById("query-display").value = endpoint.uri;

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
		// TODO: if qdisp-val contains "\n\n" delimiter (ad to cfg), explode on delimiter
		// loop array, ajax then append response to qresponse string (display value string)

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

	resetUriParam = function(paramName) {
		let endpointId = document.getElementById("endpoint-select").value;
		if(cache[paramName]) {
			delete cache[paramName];
		}
		document.getElementById("query-display").value = getUrlParamValues(config.apiFormEndpoints[endpointId].uri);
	}

	onSelectParam = function(selectBox) {
		let paramName = selectBox.id.replace("_select", "")
		clearDependentParams(selectBox);
		document.getElementById("query-response-display").value = "";
		cache[paramName] = selectBox.value;
		refreshQueryDisplay();

		// Check for a dependent param
		let endpointId = document.getElementById("endpoint-select").value, param;
		for(var index in config.apiFormEndpoints[endpointId].params) {
			param = config.apiFormEndpoints[endpointId].params[index];
			if(param.depends_on == paramName) {
				addParameterSelectBox(param);
			}
		}
	}

	onCheckParam = function(checkBox) {
		let endpointId = document.getElementById("endpoint-select").value,
			uri = config.apiFormEndpoints[endpointId].uri,
			paramName = checkBox.name;

		uri = uri.replace("{" + paramName + "}", checkBox.value) + "\n\n";
		uri = getUrlParamValues(uri);

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
	}

	addParameterSelectBox = function(param) {
		if(!document.getElementById(param.name + "_select")) {
			let formGroup = document.createElement("DIV");
			formGroup.classList.add("form-group");
			formGroup.classList.add("param-select");

			let url = config.apiDomain + getUrlParamValues(param.data);
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
		xhttp.open(type, url, false);
		xhttp.send();
	}

	resetDisplays = function() {
		document.getElementById("query-display").value = "";
		document.getElementById("query-response-display").value = "";
		document.getElementById("param-options").innerHTML = "";
	}

	refreshQueryDisplay = function() {
		let endpointId = document.getElementById("endpoint-select").value;
		let uri = config.apiFormEndpoints[endpointId].uri;
		document.getElementById("query-display").value = getUrlParamValues(uri);
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
		resetUriParam: function(paramName) {
			return resetUriParam(paramName);
		},
		onSelectParam: function(selectBox) {
			return onSelectParam(selectBox);
		},
		onCheckParam: function(checkBox) {
			onCheckParam(checkBox);
		}
	}
})()