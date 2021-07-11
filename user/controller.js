/**
 Copyright 2021 University of Denver
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

 'use strict'

var config = require("../config/config.js"),
	Service = require("./service");

exports.validateKey = async function(req, res, next) {
    if(req.query.key) {
    	if(await Service.validateKey(req.query.key) !== false) {
    		next();
    	}
    	else {
    		res.status(401).send("Unauthorized");
    	}
    }
    else {
    	res.status(403).send("API key is required");
    }
}