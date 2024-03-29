'use strict'

const CadApiForm = (function() {
		
	var initForm;
	var onCheckTerms;
	var ackTerms;
	var onSelectEndpointOption;
	var onClickFormGet;
	var submitEmailAddress;
	var setApiKey;
	var onSelectParam;
	var onCheckParam;
	var onSelectAllItems;

	var ajaxRequest;
	var clearResponseDisplay;
	var resetDisplays;
	var resetForm;
	var refreshQueryDisplay;
	var resetUriParam;
	var clearDependentParams;
	var addParameterSelectBox;
	var getUrlParamValues;
	var displayTemplate;
	var renderTemplate;
	var enableTermsAcknowledgementCheckbox;

	var config;
	var apiKey;
	var cache;

	initForm = function(configObject) {
		config = configObject;
		apiKey = "";

		cache = {
			collectionId: "",
			itemId: []
		};

		ackTerms = false;

		resetDisplays();

		// Add an option to the select box for each endpoint
		let endpoint;
		let option;
		let select = document.getElementById("endpoint-select");
		for(var index in config.apiFormEndpoints) {
			endpoint = config.apiFormEndpoints[index];
			option = document.createElement("OPTION");
			option.setAttribute("value",  index);
			option.innerHTML = endpoint.label || "No label";
			select.appendChild(option);
		}
	}

	onCheckTerms = function(checkbox) {
		if(ackTerms) {
			document.getElementById("endpoint-select").classList.remove("disabled");
			document.getElementById("get-submit").classList.remove("disabled");
			document.getElementById("query-display").classList.remove("disabled");

			// Disable uncheck terms once checked
			document.getElementById("terms-check").classList.add("disabled");
		}
		else {
			// If the terms page has not been opened, uncheck the box and show feedback message
			document.getElementById("terms-check").checked = false;
			alert("Please review the Terms of Use before using the form");
		}
	}

	displayTemplate = function(endpointId) {
		let templates = config.apiFormEndpoints[endpointId].templates || {}, url;

		if(Object.keys(templates).length == 0) {
			let codeDisplays = document.querySelectorAll(".code-display");

			for(var display of codeDisplays) {
				display.innerText = "Code is not available for this request";
			}
		}
		else {
			for(var key in templates) {
				document.getElementById(key + "-display").innerHTML = "";
				url = config.apiDomain + "/template/" + templates[key] + "?key=" + apiKey;

				ajaxRequest("get", url, function(error, status, template) {
					if(error) {
						console.log(error);
					}
					else {
						document.getElementById(key + "-display").innerHTML = renderTemplate(template, {...cache, apiKey});

						// Show the copy text button
						document.getElementById(key + "-display").nextElementSibling.style.display = "block";
					}
				});
			}
		} 
	}

	onSelectEndpointOption = function(endpointId) {
		cache['collectionId'] = "";
		cache['itemId'] = [];

		resetDisplays();
		let endpoint = config.apiFormEndpoints[endpointId];
		document.getElementById("endpoint-select").value = endpointId;
		document.getElementById("query-display").value = config.apiDomain + endpoint.uri;

		// Show the copy text button
		document.getElementById("query-display").nextElementSibling.style.display = "block";

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

	onClickFormGet = function() {
		clearResponseDisplay();
		let uris = document.getElementById("query-display").value.split("\n\n"), 
			urls = [];

		for(var uri of uris) {
			if(uri.length > 0) {
				urls.push(uri);
			}
		}

		// Fetch the object data. Add the object data to the data display
		let endchar = "", paramData;
		for(var index=0; index < urls.length; index++) {
			urls[index] += "?key=" + apiKey;

			ajaxRequest("get", urls[index], function(error, status, response, url) {
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

			       	// Show the copy text button
			       	document.getElementById("query-response-display").nextElementSibling.style.display = "block";

			       	// Display the data objects in an array
			       	if(cache[cache.currentParam] && typeof cache[cache.currentParam] == "object") {

			       		// This is the first object in the set, add the opening array bracket to the display
				       	if(index == 0) {
				       		document.getElementById("query-response-display").value = "[";
				       	}

				       	// There will be another object in the next iteration. append comma to delimit the ext array element
				       	if(urls.length > 1 && (index+1) < urls.length) {
				       		endchar = ",\n\n";
				       	}
				       	// This is the last object to add to the display. append the closing array bracket
				       	else {
				       		endchar = "]";
				       	}
			       	}

			       	if(url.indexOf("/transcript") > 0) {
			       		// Display the data as a single string, with newline formatting
						document.getElementById("query-response-display").value += (data + endchar);
			       	}
			       	else {
			       		// Display the data as a formatted json string
			       		document.getElementById("query-response-display").value += (JSON.stringify(data, undefined, 4)) + endchar;
			       	}
				}
			});
		}
	}

	/* email.js */
	submitEmailAddress = function() {
		let address = document.getElementById("email").value.substring(0, config.maxEmailChars),
			url = config.apiDomain + "/form/requestKey";

		if(address.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm)) {
			document.getElementById("email").style.color = "green";
			document.getElementById("email").value = "Request for API key sent.";
			console.log("Sending request for api key");
			ajaxRequest("post", url, function(error, status, response) {
				setTimeout(function() { 
					document.getElementById("email").style.color = "inherit";
					document.getElementById("email").value = "";
					document.getElementById("email").placeholder = "Enter email to receive API key"; 
				}, 3000);

				if(error) {
					document.getElementById("email").style.color = "red";
					document.getElementById("email").value = "Error";
					console.log("Error requesting API key:", error);
				}
				else if(status == 200) {
					console.log("Request for API key sent successfully");
					document.getElementById("email").value = "Request for API key sent successfully";
					console.log(response);
				}
				else {
					document.getElementById("email").style.color = "red";
					document.getElementById("email").value = "We're sorry, but an error has occurred";
					console.log("Error requesting API key, server returned status", status);
				}
			}, {"email": address});
		}
		else {
			document.getElementById("email").style.color = "red";
			document.getElementById("email").value = "Invalid email address";
		}
	}

	/* api.js */
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
					apiKey = key;

					document.getElementById("terms-ack").style.display = "flex";
					resetForm();
					document.getElementById("api-key-feedback").style.display = "block";
					document.getElementById("api-key").disabled = true;
					document.getElementById("api-key-set").disabled = true;
					document.getElementById("api-key").style.color = "grey";
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

	renderTemplate = function(template, data) {
		let key;
		let value = "Unset";

		let params = template.match(/{(.*?)\}/g).map((param) => {
				return param.replace(/[{|}]+/g, '');
		}) || [];

		template = template.replace('{apiDomain}', config.apiDomain);

		for(var param of params) {
				if(data[param]) {
					value = JSON.stringify(data[param]);
					template = template.replace(new RegExp('{' + param + '}', 'g'), value);
				}
				else {
					template = template.replace(new RegExp('{' + param + '}', 'g'), "");
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
		cache[paramName] = selectBox.value;
		cache.currentParam = paramName;
		clearResponseDisplay();
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
		clearResponseDisplay();
		let endpointId = document.getElementById("endpoint-select").value,
			uri = config.apiDomain + config.apiFormEndpoints[endpointId].uri,
			paramName = checkBox.name;

		cache.currentParam = paramName;
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

						let selectAll = document.createElement("INPUT");
						selectAll.setAttribute("type", "checkbox");
						selectAll.setAttribute("onclick", "CadApiForm.onSelectAllItems(this)");
						let label = document.createElement("LABEL");
						label.innerHTML = "&nbsp;&nbsp;Select All";
						formGroup.appendChild(selectAll);
						formGroup.appendChild(label);

						// Populate with checkboxes (onclick onCheckParam(checkBox))
						let container = document.createElement("DIV");
						container.classList.add("list-container");
						container.classList.add("form-control");
						let list = document.createElement("UL"), listItem, checkbox, item;
						list.setAttribute("id", param.name + "_select");
						list.setAttribute("class", "item-select");

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

						if(list.children.length == 0) {
							let message = `We're sorry, no items were found in this collection with ${param.required_field} data`;
							container.setAttribute("title", message)
							container.innerHTML = message;
						}
						else {
							container.appendChild(list);
						}

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

	onSelectAllItems = function(optionList) {
		let items = document.querySelectorAll(".item-select li input[type='checkbox']");
		for(let index=0; index<items.length; index++) {
			items[index].click();
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

		// TODO seriously, replace this dom traversal with something readable
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

	/* ajax.js */
	ajaxRequest = function(type, url, callback, body=null) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
				if(this.readyState == 2) {
					console.log("Server received request");
				}
		    else if(this.readyState == 4) {	
		      callback(null, this.status, xhttp.responseText, url);
		    }
		};

		if(type.toLowerCase() == "post") {
			let data = {};
			if(body) {
				data = body;
			}

			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-type", "application/json");
			xhttp.send(JSON.stringify(data));
		}
		else {
			xhttp.open("GET", url, false);
			xhttp.send();
		}
	}

	clearResponseDisplay = function() {
		document.getElementById("query-response-display").value = "";
		document.querySelector(".query-response-section .copy-text-link").style.display = "none";
	}

	resetDisplays = function() {
		document.getElementById("query-display").value = "";
		document.getElementById("query-response-display").value = "";
		document.getElementById("param-options").innerHTML = "";

		var copyButtons = document.getElementsByClassName("copy-text-link");
		for(var i=0; i<copyButtons.length; i++) {
			copyButtons[i].style.display = "none";
		}

		var codeDisplays = document.getElementsByClassName("code-display");
		for(i=0; i<codeDisplays.length; i++) {
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

	enableTermsAcknowledgementCheckbox = function() {
		ackTerms = true;
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
		onClickFormGet: function() {
			onClickFormGet();
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
		},
		onSelectAllItems: function(checkBox) {
			onSelectAllItems(checkBox);
		},
		enableTermsAcknowledgementCheckbox: function() {
			enableTermsAcknowledgementCheckbox();
		}
	}
})()