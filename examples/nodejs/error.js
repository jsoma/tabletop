var Tabletop = require('../../');

var testURL = 'THIS_WONT_WORK';

function onLoad(data, tabletop) {
  console.log(data);
};

function onError(err) {
  console.log("Failed");
};


var options = {
  key: testURL,
  callback: onLoad,
  error: onError,
  simpleSheet: true
};

Tabletop.init(options);
