/**
 *
 */
'use strict';

module.exports = {
	itemMetadataFields: {
        "default": {
            "title": {
	            "path": "display_record.title",
	            "display": "text"
	        },
	        "dateCreated": {
	            "path": "display_record.dates.expression",
	            "matchField": "label",
	            "matchValue": "creation"
	        },
	        "description": {
	            "path": "display_record.notes.content",
	            "matchField": "type",
	            "matchValue": "abstract",
	            "display": "text"
	        },
	        "place": {
                "path": "display_record.subjects.terms.term",
                "matchField": "type",
                "matchValue": "geographic"
            },
            "subject": {
                "path": "display_record.subjects.title",
                "excludeField": "terms.type",
                "excludeValue": ['geographic', 'genre_form']
            },
            "type": {
            	"path": "type",
            	"display": "text"
            },
	        "creator": {
	            "path": "display_record.names.title"
	        },
	        "identifier": {
	        	"path": "display_record.identifiers.identifier",
	        	"matchField": "type",
	        	"matchValue": "local"
	        },
	        "language": {
	        	"path": "display_record.t_language.language",
	        	"display": "text"
	        },
	        "extent": {
                "path": "display_record.extents"
            },
            "format": {
            	"path": "mime_type",
            	"display": "text"
            }
        }
    }
}