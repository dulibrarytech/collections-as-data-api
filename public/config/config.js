var config = {
	apiDomain: "http://localhost:3000",

	apiFormEndpoints: {
        "collections": {
            "id": "collections",
            "label": "All Collections",
            "uri": "/collections",
            "params": null
        },
        "collection": {
            "id": "collection",
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
        "collectionItems": {

        },
        "item": {

        },
        "itemTranscript": {
            
        }
    }
}