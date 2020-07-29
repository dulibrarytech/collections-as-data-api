var config = {
	apiDomain: "http://localhost:3000",
	defaultEndpoint: "collections",
    maxEmailChars: "50",

	apiFormEndpoints: {
        "collections": {
            "label": "All Collections",
            "uri": "/collections",
            "params": null
        },
        "collection": {
            "label": "Collection Data",
            "uri": "/collections/{collectionId}",
            "params": [
                {
                    "param_id": "collectionId",
                    "name": "collectionId",
                    "label": "Select a Collection",
                    "data": "/collections",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": null,
                    "multi_select": false,
                    "required_field": "title"
                }
            ]
        },
        "collection_items": {
        	"label": "Collection Items",
        	"uri": "/collections/{collectionId}/items",
            "templates": {
                "python": "collectionItems"
            },
        	"params": [
                {
                    "param_id": "collectionId",
                    "name": "collectionId",
                    "label": "Select a Collection",
                    "data": "/collections",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": null,
                    "multi_select": false,
                    "required_field": "title"
                }
            ]
        },
        "item": {
        	"label": "Item",
        	"uri": "/collections/{collectionId}/items/{itemId}",
        	"params": [
                {
                    "param_id": "collectionId",
                    "name": "collectionId",
                    "label": "Select a Collection",
                    "data": "/collections",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": null,
                    "multi_select": false,
                    "required_field": "title"
                },
                {
                    "param_id": "itemId",
                    "name": "itemId",
                    "label": "Select an Item or Items",
                    "data": "/collections/{collectionId}/items",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": "collectionId",
                    "multi_select": true,
                    "required_field": "title"
                }
            ]
        },
        "item_transcript": {
            "label": "Item Transcript",
        	"uri": "/collections/{collectionId}/items/{itemId}/transcript",
        	"params": [
                {
                    "param_id": "collectionId",
                    "name": "collectionId",
                    "label": "Select a Collection",
                    "data": "/collections",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": null,
                    "multi_select": false,
                    "required_field": "title"
                },
                {
                    "param_id": "itemId",
                    "name": "itemId",
                    "label": "Select an Item or Items",
                    "data": "/collections/{collectionId}/items",
                    "option_map": {
                        "value": "id",
                        "text": "title"
                    },
                    "depends_on": "collectionId",
                    "multi_select": true,
                    "required_field": "transcript"
                }
            ]
        }
    }
}