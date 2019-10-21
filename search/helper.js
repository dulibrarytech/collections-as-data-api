 /**
 * @file 
 *
 * Search Helper Functions
 *
 */

'use strict';

var config = require('../config/' + process.env.CONFIGURATION_FILE),
    appHelper = require('../libs/helper');

/**
 * Creates an Elastic 'aggs' query for an Elastic query object 
 *
 * @param {Object} facets - DDU facet fields configuration
 * @return {Object} Elastic DSL aggregations query object
 */
exports.getFacetAggregationObject = function(facets) {
  var facetAggregations = {}, field;
    for(var key in facets) {
      field = {};
      field['field'] = facets[key].path + ".keyword";
      field['size'] = config.facetLimit;
      facetAggregations[key] = {
        "terms": field
      };
    }
    return facetAggregations;
}

/**
 * Create an Elastic date range query from search date range values
 *
 * @param {daterange} daterange - From and to values defining the daterange
 *
 * @typedef {Object} daterange
 * @property {String} from - Daterange 'search from' date.  Year only [YYYY]
 * @property {String} to - Daterange 'search to' date.  Year only [YYYY]
 *
 * @return {Object} Elastic daterange query object
 */
exports.getDateRangeQuery = function(daterange) {
  var dateQuery = {
      "bool": {
        "should": [],
        "must": []
      }
    },
    beginRange = {}, endRange = {};

    // Add the match field query if a match field has been set
    if(config.dateFieldMatchField && config.dateFieldMatchField.length > 0) {
      let matchField = {};
      matchField[config.dateFieldMatchField] = config.dateFieldMatchValue;
      dateQuery.bool.must.push({
        "match_phrase": matchField
      });
    }

    // QI Check if begin date is included in the range
    beginRange[config.beginDateField] = {
      "gte": daterange.from,
      "lte": daterange.to
    };
    dateQuery.bool.should.push({
      "range": beginRange
    });

    // QII Check if end date is included in the range
    endRange[config.endDateField] = {
      "gte": daterange.from,
      "lte": daterange.to
    };
    dateQuery.bool.should.push({
      "range": endRange
    });

    // QIII, QIV Check for object date span that envelops the selected daterange
    var temp = [], beginRange = {}, endRange = {};
    beginRange[config.beginDateField] = {
      "lte": daterange.from
    };
    temp.push({
      "range": beginRange
    });
    endRange[config.endDateField] = {
      "gte": daterange.to
    };
    temp.push({
      "range": endRange
    });

    dateQuery.bool.should.push({
      "bool": {
        "must": temp
      }
  });

  return config.nestedDateField ? {
    nested: {
      path: config.beginDateField.substring(0,config.beginDateField.lastIndexOf(".")),
      query: dateQuery
    }
  } : dateQuery;
}

/**
 * Retrieve search field(s) from the configuration
 *
 * @param {String} fieldValue - A search field label from the configuration
 * If a search field label is passed in, the corresponding search field data will be retrieved from the configuration 
 * If fieldValue is "all", all search fields will be retrieved from the configuration 
 *
 * @return {Array.<Object>} Array of search fields defined in the configuration
 */
exports.getSearchFields = function(fieldValue) {
  var fields = [];

  // Non-scoped search: Search in all of the fields in the fulltext search
  if(fieldValue.toLowerCase() == 'all') {
    fields = config.searchAllFields;
  }

  // Scoped search: Use the selected type in the search type dropdown
  else {
    for(var field of config.searchAllFields) {
      if(field.id.toLowerCase() == fieldValue.toLowerCase()) {
          fields.push(field);
      }
    }
  }

  return fields;
}

/**
 * Build the search query data array (for multiple advanced search queries, or a single search) from the search url parameters
 * Combines the data in the four input arrays into one query data object per array index
 *
 * @param {Array.<String>} queryArray - Query strings, one per query
 * @param {Array.<String>} fieldArray - Search fields, one per query
 * @param {Array.<String>} typeArray - Search types, one per query
 * @param {Array.<String>} boolArray - Query boolean terms, one per query
 *
 * @typedef {Object} queryData
 * @property {String} terms - Query string
 * @property {String} field - Search field
 * @property {String} type - Search type
 * @property {String} bool - Query boolean term 
 *
 * @return {Array.<queryData>} queryDataArray
 */
exports.getSearchQueryDataObject = function(queryArray, fieldArray, typeArray, boolArray) {
  var queryDataArray = [];

  for(var index in queryArray) {

    // Default empty queries to wildcard "all results" query
    if(queryArray[index] == "") {
      queryArray[index] = '*';
    }

    queryDataArray.push({
      terms: queryArray[index],
      field: fieldArray[index],
      type: typeArray[index],
      bool: boolArray[index]
    });
  }

  return queryDataArray;
}

/**
 * Convert the sort params array into a data array for the search function
 * Sorting by "relevance" will return null, no sorting is required
 *
 * @param {String} sort - The sort string: two terms delimited by "," (ex "sort field,sort type" or "Title,asc")
 *
 * @typedef {Object} sortData
 * @property {String} field - First value of comma delimited "sort" string
 * @property {String} order - Second value of comma delimited "sort" string
 *
 * @return {sortData|null} - The sort data object.  Null will be returned if the sort value is "relevance"
 */
exports.getSortDataArray = function(sort) {
  let sortData = null;
  if(sort && sort != "") {
    sort = sort.split(",");

    // If the sort field value is "relevance", do not assign the sort data, this is the default search
    if(sort[0] != "relevance") {
      sortData = {
        field: sort[0],
        order: sort[1]
      }
    }
  }
  return sortData;
}

/**
 * Determine the Elastic search type for a query
 *
 * @param {queryData} - Query data object
 *
 * @typedef {Object} queryData
 * @property {String} terms - Query string
 * @property {String} field - Search field
 * @property {String} type - Search type
 * @property {String} bool - Query boolean term
 *
 * @return {String} - The Elastic query type DSL field
 */
exports.getQueryType = function(queryData) {
  var queryType = "match";

  if(queryData.type == "isnot") {
    queryType = "must_not";
  }
  else if(queryData.type == "is") {
    queryType = "match_phrase";
  }
  else if(queryData.terms[0] == '"' && queryData.terms[ queryData.terms.length-1 ] == '"') {
    queryData.terms = queryData.terms.replace(/"/g, '');
    queryType = "match_phrase";
  }
  else if(queryData.terms.indexOf('*') >= 0 || queryData.terms.indexOf('?') >= 0) {
    queryType = "wildcard";
  }
  else  {
    queryType = "match";
  }

  return queryType;
}

exports.getDateRangeObject = function(range) {

}