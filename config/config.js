/**
 *
 */

'use strict';

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    apiKey: process.env.MASTER_API_KEY || "",
    appDomain: process.env.APPLICATION_DOMAIN,
    elasticHost: process.env.ELASTICSEARCH_HOST,
    elasticPort: process.env.ELASTICSEARCH_PORT,
    elasticIndex: process.env.ELASTICSEARCH_INDEX,
    indexType: process.env.ELASTICSEARCH_INDEX_TYPE,
    repositoryDomain: process.env.REPOSITORY_DOMAIN,
    rootUrl: process.env.PROTOCOL + "://" + process.env.APPLICATION_DOMAIN,
    discoveryApiDomain: process.env.DISCOVERY_APPLICATION_DOMAIN,
    mailServer: process.env.MAIL_SERVER,
    mailServerPort: process.env.MAIL_SERVER_PORT,
    encryptionKey: process.env.ENCRYPTION_KEY,
    encryptionInitVector: process.env.ENCRYPTION_INITIALIZATION_VECTOR,

    objectAccessDomain: "https://specialcollections.du.edu",
    objectAccessPath: "/object",
    objectAccessParams: "",
    thumbnailAccessDomain: "https://specialcollections.du.edu",
    thumbnailAccessPath: "/datastream",
    thumbnailAccessParams: "/tn",
    iiifAccessDomain: "https://specialcollections.du.edu",
    iiifAccessPath: "/iiif",
    iiifAccessParams: "/manifest",

    itemMetadataFields: {
        "Title": {
            "path": "display_record.title"
        },
        "Creator": {
            "path": "display_record.names.title"
        },
        "Creation Date": {
            "path": "display_record.dates.expression",
            "matchField": "label",
            "matchValue": "creation"
        },
        "Item Type": {
            "path": "type"
        },
        "Description": {
            "path": "display_record.notes.content",
            "matchField": "type",
            "matchValue": "abstract"
        },
        "Resource URI": {
            "path": "object"
        }
    },

    collectionMetadataFields: {
        "Title": {
            "path": "title"
        },
        "Creator": {
            "path": "creator"
        },
        "Description": {
            "path": "abstract"
        }
    },

    /*
     * Fulltext search fields 
     * Define all search fields here
     *
     * @example - Index display record
     *      "subjects": [
     *           {
     *               "authority": "lcsh",
     *               "title": "Deciduous",
     *               "terms": [
     *                   {
     *                       "type": "subject",
     *                       "term": "Maine"
     *                   }
     *               ],
     *               "authority_id": ""
     *           },
     *           {
     *               "authority": "lcsh",
     *               "title": "Forestry",
     *               "terms": [
     *                   {
     *                       "type": "topic",``
     *                       "term": "Forests"
     *                   }
     *               ],
     *               "authority_id": ""
     *           }
     *       ]
     *
     * @example - searchAllField object example
     *          // Use the "term" field value if the sibling field "type" has the value "topic".  Other "term" values will be ignored
     *          {"label": "Subject", "id": "subject", "field": "subjects.terms", "matchField": "subjects.terms.type", "matchTerm": "topic"} 
     *
     *          // If field data is of type "nested", set the "isNestedType" param to true to enable searching within nested data
     *          {"label": "Subject", "id": "subject", "field": "subjects.terms", "matchField": "subjects.terms.type", "matchTerm": "topic", "isNestedType": "true"} 
     */ 
    searchAllFields: [
        {"label": "Title", "id": "title", "field": "title", "boost": "1"},
        {"label": "Collection", "id": "collection", "field": "is_member_of_collection"},
        {"label": "Creator", "id": "creator", "field": "creator", "boost": "3"},
        {"label": "Subject", "id": "subject", "field": "f_subjects", "boost": "2"},
        {"label": "Topic", "id": "topic", "field": "display_record.subjects.terms.term", "matchField": "display_record.subjects.terms.type", "matchTerm": "topical"},
        {"label": "Type", "id": "type", "field": "type", "boost": "2"},
        {"label": "Description", "id": "description", "field": "abstract", "boost": "3"},
        {"label": "Language", "id": "language", "field": "display_record.t_language.text", "boost": "5"},
        {"label": "Creation Date", "id": "create_date", "field": "display_record.dates.expression", "isNestedType": "false", "matchField": "display_record.dates.label", "matchTerm": "creation"},
        {"label": "Call Number", "id": "call_number", "field": "display_record.identifiers.identifier", "isNestedType": "false", "matchField": "display_record.identifiers.type", "matchTerm": "local"}
    ],

    /*
     * Selectable search fields for the standard search.  These will appear in 'Search Type' dropdown list
     * (ex { "Label" : "searchAllFields.id" })
     */ 
    searchFields: [
        {"Title": "title"},
        {"Creator": "creator"},
        {"Subject": "subject"},
        {"Type": "type"},
        {"Description": "description"}
    ],

    /*
     * Selectable search fields for the advanced search
     * { "Label" : "searchAllFields.id" }     
     */ 
    advancedSearchFields: [
        {"Title": "title"},
        {"Creator": "creator"},
        {"Subject": "subject"},
        {"Type": "type"},
        {"Description": "description"},
        {"Creation Date": "create_date"},
        {"Language": "language"},
        {"Call Number": "call_number"},
        {"Topic": "topic"},
        {"Collection": "collection"}
    ],

    /*
     * Search result sort fields
     * Ex. Will sort on names.namePart value if names.role == 'creator'
     * { "Creator" : {
     *          "path": "names.namePart",
     *          "matchField": "names.role",
     *          "matchValue": "creator"
     *     }
     * }
     */
    searchSortFields: {
        "Title": {
            "path": "title",
            "matchField": "",
            "matchTerm": ""
        },
        "Creator": {
            "path": "creator"
        },
        "Creation Date": {
            "path": "display_record.dates.expression"
            // "matchField": "display_record.dates.label",
            // "matchTerm": "creation"
        },
        "Call Number": {
            "path": "display_record.identifiers.identifier"
            // "matchField": "display_record.identifiers.type",
            // "matchTerm": "local"
        }
    },

    collectionSortFields: {
        "Title": {
            "path": "title.keyword"
        }
    },

    /*
     * Options to appear in the search sort dropdown menu
     * { "Display Label" : "searchSortField display label, [asc|desc]" }
     */
    sortByOptions: {
        "Relevance": "relevance", // default
        "Title (a - z)": "Title,asc",
        "Title (z - a)": "Title,desc",
        "Creator (a - z)": "Creator,asc",
        "Creator (z - a)": "Creator,desc",
        "Creation Date (asc)": "Creation Date,asc",
        "Creation Date (desc)": "Creation Date,desc",
        "Call Number (asc)": "Call Number,asc"
    },

    collectionSortByOptions: {
        "Title (a - z)": "Title,asc",
        "Title (z - a)": "Title,desc"
    },

    /*
     * Advanced Search query options
     */
    searchTypes: [
        {"Contains": "contains"},
        {"Is": "is"}
    ],
    booleanSearchFields: [
        {"AND": "and"},
        {"OR": "or"},
        {"NOT": "not"}
    ],

    /*
     * Fuzz factor: number of fuzzy characters in the search terms
     */
    searchTermFuzziness: "2",

    /*
     * Facets to display on the search results view
     *
     * @example
     * { "Creator" : {
     *          "path": "names.namePart",
     *          "matchField": "names.role",
     *          "matchValue": "creator"
     *     }
     * }
     */
    facets: {
        "Creator": {
            "path": "display_record.names.title"
        },
        "Subject": {
            "path": "f_subjects"
        },
        "Type": {
            "path": "type"
        },
        "Date": {
            "path": "display_record.dates.expression",
            "matchField": "display_record.dates.label",
            "matchTerm": "creation"
        },
        "Collection": {
            "path": "is_member_of_collection"
        },
        "Authority ID": {
            "path": "display_record.subjects.authority_id"
        }
    },

    /*
     * Set to false if collection objects should be omitted from search results
     */
    showCollectionObjectsInSearchResults: true
}