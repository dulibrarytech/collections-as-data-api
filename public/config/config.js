var config = {
	apiDomain: "http://localhost:3000",
	defaultEndpoint: "collections",

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
                    "multi_select": false
                }
            ]
        },
        "collection_items": {
        	"label": "Collection Items",
        	"uri": "/collections/{collectionId}/items",
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
                    "multi_select": false
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
                    "multi_select": false
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
                    "multi_select": true
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
                    "multi_select": false
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
                    "multi_select": true
                }
            ]
        }
    }
}