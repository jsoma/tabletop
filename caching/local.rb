#####
# Run as 
# ruby local.rb "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdE5OcDE1SENpT1g2R2JEX2tnZ3ZIWHc&output=html"
######

require 'open-uri'
require 'json'

dirty_key = ARGV[0]
key = dirty_key.gsub(/.*key=(.*?)\&.*/,'\1')

puts key

base_json_url = "https://spreadsheets.google.com/feeds/worksheets/#{key}/public/basic?alt=json-in-script&callback=Tabletop.singleton.loadSheets"

base_json_content = open(base_json_url).read

sheet_ids = base_json_content.scan(/\/public\/basic\/(\w*)/).flatten.uniq

sheet_ids.each do |sheet_id|
  sheet_url = "https://spreadsheets.google.com//feeds/list/#{key}/#{sheet_id}/public/values?alt=json-in-script&sq=&callback=Tabletop.singleton.loadSheet"
  content = open(sheet_url).read
  File.open("#{key}-#{sheet_id}", 'w') { |f| f.write(content) } 
end

File.open("#{key}", 'w') { |f| f.write(base_json_content) } 