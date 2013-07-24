#!/usr/bin/env python

# Caches google spreadsheet on demand in Python
# Run as python local.py your_spreadsheet_key

import sys
import urllib2
import re
import json

# Be sure to call this file with a Google Spreadsheet key as the first argument

key = sys.argv[1]

base_json_url = "https://spreadsheets.google.com/feeds/worksheets/"+key+"/public/basic?alt=json-in-script&callback=Tabletop.singleton.loadSheets"

base_json_content = urllib2.urlopen(base_json_url).read()

sheet_ids = set(re.findall(r"/public/basic/(\w*)",base_json_content, flags=0))

for sheet_id in sheet_ids:
  sheet_url = "https://spreadsheets.google.com//feeds/list/"+key+"/"+sheet_id+"/public/values?alt=json-in-script&sq=&callback=Tabletop.singleton.loadSheet"
  content = urllib2.urlopen(sheet_url).read()
  with open(key+"-"+sheet_id, "w") as f:
		f.write(content)
		
with open(key, "w") as f:
	f.write(base_json_content)
