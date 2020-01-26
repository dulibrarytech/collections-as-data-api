import os
import http.client
from urllib.request import urlopen
import json
from zipfile import ZipFile
import shutil

def request_api_data(uri):
    connection = http.client.HTTPConnection('libspecc01-vlp.du.edu')
    connection.request('GET', uri)
    response = connection.getresponse()
    return json.loads(response.read())

def stream_to_file(uri, filename):
    response = urlopen(uri)
    CHUNK = 16 * 1024
    with open(filename, 'wb') as f:
        while True:
            chunk = response.read(CHUNK)
            if not chunk:
                break
            f.write(chunk)
        print("Created " + filename)

print("Downloading item data...")

with open("items.txt", "r") as f:
    collections = f.readlines()

collections = [x.strip() for x in collections]
for collection in collections:
    data = collection.split(',')
    collection_id = data[0]
    num_of_items = int(data[1])

    collection_folder = "collection_" + collection_id
    zipObj = ZipFile(collection_folder + '.zip', 'w')

    collection_uri = "/cad/collections/" + collection_id + "/items"
    collection_items = request_api_data(collection_uri)
    print("Retrieving data for " + str(num_of_items) + " items from collection " + collection_id)

    for i in range(num_of_items):
        item_id = collection_items["data"][i]["id"]
        item_uri = "/cad/collections/" + collection_id + "/items/" + item_id
        item_data = request_api_data(item_uri)
        filename = item_id + "_metadata.txt"
        item_metadata_file = open(filename, "w")

        for field in item_data["data"]:
            line = field + ": " + item_data["data"][field]["value"][0] + '\n'
            item_metadata_file.write(line)

        item_metadata_file.close()
        zipObj.write(filename)

        item_transcript_uri = "/cad/collections/" + collection_id + "/items/" + item_id + "/transcript"
        item_transcript_data = request_api_data(item_transcript_uri)
        if len(item_transcript_data["data"]) > 0:
            filename = item_id + "_transcript.txt"
            item_transcript_file = open(filename, "x")
            item_transcript_file.write(item_transcript_data["data"])
            item_transcript_file.close()
            zipObj.write(filename)

        item_resource_uri = "http://libspecc01-vlp.du.edu/discovery/datastream/" + item_id + "/object"
        extension = item_data["data"]["Resource URI"]["value"][0][-3:]
        filename = item_id + "_resource" + "." + extension
        print("Downloading file: " + filename)

        stream_to_file(item_resource_uri, filename)
        zipObj.write(filename)

