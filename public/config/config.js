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
            "uri": "/collection/{collectionId}",
            "params": [
                {
                    "paramId": "collection",
                    "name": "collectionId",
                    "data": "/collections",
                    "map": {
                        "id": "title"
                    },
                }
            ]
        },
        "collection_items": {

        },
        "item": {

        },
        "item_transcript": {
            
        }
    }
}