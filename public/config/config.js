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
                    "label": "Select Collection",
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
                    "label": "Select Collection",
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

        },
        "item_transcript": {
            
        }
    }
}