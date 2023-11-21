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

const NodeCache = require( "node-cache" );
const CACHE = new NodeCache();

exports.read = function(key) {
    let data = false;
    let result = false;
    
    try {
        result = CACHE.get(key);
        if(result) data = result;
    }
    catch(e) {
        console.error("Error reading from cache:", e)
    }

    return data;
}

exports.write = function(key, data) {
    let success = false;

    try {
        success = CACHE.set(key, data);
    }
    catch(e) {
        console.error("Error writing to cache:", e)
    }

    return success;
}