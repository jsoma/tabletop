#####
# Run as 
# ruby local.rb "https://docs.google.com/spreadsheets/d/0AmYzu_s7QHsmdE5OcDE1SENpT1g2R2JEX2tnZ3ZIWHc/pubhtml"
# You will need to have shared the spreadsheet as well as publishing it; "link only" is fine.
# If certificate errors, follow the instructions here to download a cacert.pem
#####

require 'open-uri'
require 'json'
require 'uri'

dirty_key = ARGV[0]
uri_parsed = URI.split(dirty_key)[5]
key = uri_parsed.split('/')[3]

puts key

base_json_url = "https://spreadsheets.google.com/feeds/worksheets/#{key}/public/basic?alt=json-in-script&callback=Tabletop.singleton.loadSheets"

base_json_content = open(base_json_url).read

sheet_ids = base_json_content.scan(/\/public\/basic\/(\w*)/).flatten.uniq

sheet_ids.each do |sheet_id|
  sheet_url = "https://spreadsheets.google.com/feeds/list/#{key}/#{sheet_id}/public/values?alt=json-in-script&callback=Tabletop.singleton.loadSheet"
  content = open(sheet_url).read
  File.open("#{key}-#{sheet_id}", 'w') { |f| f.write(content) } 
end

File.open("#{key}", 'w') { |f| f.write(base_json_content) } 
