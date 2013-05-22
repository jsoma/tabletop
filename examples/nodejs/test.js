var Tabletop = require('../../');

var testURL = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html';

function onLoad(data, tabletop) {
  console.log(data);
};

var options = {
  key: testURL,
  callback: onLoad,
  simpleSheet: true
};

Tabletop.init(options);
