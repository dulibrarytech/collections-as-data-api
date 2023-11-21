exports.collectionItems = 
	"import os, requests, json" + "\n" +
	"from urllib.request import urlopen" + "\n" +
	"from zipfile import ZipFile" + "\n" +
	"import shutil" + "\n" +
	"\n" +
	"def stream_to_file(uri, filename):" + "\n" +
	"\tresponse = urlopen(uri)" + "\n" +
	"\tCHUNK = 16 * 1024" + "\n" +
	"\twith open(filename, 'wb') as f:" + "\n" +
	"\t\twhile True:" + "\n" +
	"\t\t\tchunk = response.read(CHUNK)" + "\n" +
	"\t\t\tif not chunk:" + "\n" +
	"\t\t\t\tbreak" + "\n" +
	"\t\t\tf.write(chunk)" + "\n" +
	"\t\tprint('Created ' + filename)" + "\n" +
	"\n" +
	"api_key = {apiKey}" + "\n" +
	"base_url = \"{apiDomain}\"" + "\n" +
	"collection_id = {collectionId}" + "\n" +
	"url = base_url + '/collections/' + collection_id + '/items' + '?key=' + api_key" + "\n" +
	"collection_folder = 'collection_' + collection_id" + "\n" +
	"zipObj = ZipFile(collection_folder + '.zip', 'w')" + "\n" +
	"\n" +
	"print('Downloading item data...')" + "\n" +
	"\n" +
	"response = requests.get(url)" + "\n" +
	"responseObj = json.loads(response.text)" + "\n" +
	"items = responseObj['data']" + "\n" +
	"\nfor item in items:" + "\n" +
	"\titem_id = item" + "\n" +
	"\turl = base_url + '/collections/' + collection_id + '/items/' + item_id + '?key=' + api_key" + "\n" +
	"\tresponse = requests.get(url)" + "\n" +
	"\titem_data = json.loads(response.text)" + "\n" +
	"\tfilename = item_id + '_metadata.txt'" + "\n" +
	"\titem_metadata_file = open(filename, 'w')" + "\n" +
	"\t\n" +
	"\tfor field in item_data['data']:" + "\n" +
	"\t\tline = field + ': ' + json.dumps(item_data['data'][field]['value']) + '\\n'" + "\n" +
	"\t\titem_metadata_file.write(line)" + "\n" +
	"\t\n" +
	"\titem_metadata_file.close()" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)" + "\n" +
	"\turl = item_data['data']['Resource URI']['value'][0]" + "\n" +
	"\tfilename = item_id + '_resource' + '.' + url[-3:]" + "\n" +
	"\tprint('Downloading file: ' + filename)" + "\n" +
	"\tstream_to_file(url, filename)" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)";

exports.collectionItem = 
	"import os, requests, json" + "\n" +
	"from urllib.request import urlopen" + "\n" +
	"from zipfile import ZipFile" + "\n" +
	"import shutil" + "\n" +
	"\n" +
	"def stream_to_file(uri, filename):" + "\n" +
	"\tresponse = urlopen(uri)" + "\n" +
	"\tCHUNK = 16 * 1024" + "\n" +
	"\twith open(filename, 'wb') as f:" + "\n" +
	"\t\twhile True:" + "\n" +
	"\t\t\tchunk = response.read(CHUNK)" + "\n" +
	"\t\t\tif not chunk:" + "\n" +
	"\t\t\t\tbreak" + "\n" +
	"\t\t\tf.write(chunk)" + "\n" +
	"\t\tprint('Created ' + filename)" + "\n" +
	"\n" +
	"api_key = {apiKey}" + "\n" +
	"base_url = \"{apiDomain}\"" + "\n" +
	"collection_id = {collectionId}" + "\n" +
	"collection_folder = 'collection_' + collection_id" + "\n" +
	"zipObj = ZipFile(collection_folder + '.zip', 'w')" + "\n" +
	"\n" +
	"print('Downloading item data...')" + "\n" +
	"\n" +
	"items = {itemId}" + "\n" +
	"\nfor item in items:" + "\n" +
	"\titem_id = item" + "\n" +
	"\turl = base_url + '/collections/' + collection_id + '/items/' + item_id + '?key=' + api_key" + "\n" +
	"\tresponse = requests.get(url)" + "\n" +
	"\titem_data = json.loads(response.text)" + "\n" +
	"\tfilename = item_id + '_metadata.txt'" + "\n" +
	"\titem_metadata_file = open(filename, 'w')" + "\n" +
	"\t\n" +
	"\tfor field in item_data['data']:" + "\n" +
	"\t\tline = field + ': ' + json.dumps(item_data['data'][field]['value']) + '\\n'" + "\n" +
	"\t\titem_metadata_file.write(line)" + "\n" +
	"\t\n" +
	"\titem_metadata_file.close()" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)" + "\n" +
	"\turl = item_data['data']['Resource URI']['value'][0]" + "\n" +
	"\tfilename = item_id + '_resource' + '.' + url[-3:]" + "\n" +
	"\tprint('Downloading file: ' + filename)" + "\n" +
	"\tstream_to_file(url, filename)" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)";

exports.itemTranscript =
	"import os, requests, json" + "\n" +
	"from urllib.request import urlopen" + "\n" +
	"from zipfile import ZipFile" + "\n" +
	"import shutil" + "\n" +
	"\n" +
	"def stream_to_file(uri, filename):" + "\n" +
	"\tresponse = urlopen(uri)" + "\n" +
	"\tCHUNK = 16 * 1024" + "\n" +
	"\twith open(filename, 'wb') as f:" + "\n" +
	"\t\twhile True:" + "\n" +
	"\t\t\tchunk = response.read(CHUNK)" + "\n" +
	"\t\t\tif not chunk:" + "\n" +
	"\t\t\t\tbreak" + "\n" +
	"\t\t\tf.write(chunk)" + "\n" +
	"\t\tprint('Created ' + filename)" + "\n" +
	"\n" +
	"api_key = {apiKey}" + "\n" +
	"base_url = \"{apiDomain}\"" + "\n" +
	"collection_id = {collectionId}" + "\n" +
	"collection_folder = 'collection_' + collection_id" + "\n" +
	"zipObj = ZipFile(collection_folder + '.zip', 'w')" + "\n" +
	"\n" +
	"print('Downloading item data...')" + "\n" +
	"\n" +
	"items = {itemId}" + "\n" +
	"\nfor item in items:" + "\n" +
	"\titem_id = item" + "\n" +
	"\turl = base_url + '/collections/' + collection_id + '/items/' + item_id + 'transcript?key=' + api_key" + "\n" +
	"\tresponse = requests.get(url)" + "\n" +
	"\titem_data = json.loads(response.text)" + "\n" +
	"\tfilename = item_id + '_transcript.txt'" + "\n" +
	"\titem_transcript_file = open(filename, 'w')" + "\n" +
	"\t\n" +
	"\tfor field in item_data['data']:" + "\n" +
	"\t\tline = field + ': ' + item_data['data'][0] + '\\n'" + "\n" + 
	"\t\titem_transcript_file.write(line)" + "\n" +
	"\t\n" +
	"\titem_transcript_file.close()" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)" + "\n" +
	"\turl = item_data['data']['Resource URI']['value'][0]" + "\n" +
	"\tfilename = item_id + '_resource' + '.' + url[-3:]" + "\n" +	
	"\tprint('Downloading file: ' + filename)" + "\n" +
	"\tstream_to_file(url, filename)" + "\n" +
	"\tzipObj.write(filename)" + "\n" +
	"\tos.remove(filename)";
