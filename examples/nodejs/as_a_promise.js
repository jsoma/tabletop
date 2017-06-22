var Tabletop = require('../../');

var testURL = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html';

var runPromise = getSpreadsheetData(testURL);

runPromise.then((sheet_data) => {
    console.log(sheet_data);
    // do other fun stuff with sheet_data here
})
.catch((promise_err) => {
    console.log(promise_err);
});


function getSpreadsheetData(sheetURL) {
    return new Promise((resolve, reject) => {
        
        var options = {
            key: sheetURL,
            callback: onLoad, 
            simpleSheet: true
        };
        
        function onLoad(data, tabletop) {
            
            // 'data' is the array for a simple spreadsheet
            // 'tabletop' is the whole object with sheets and more.
            // could resolve(tabletop) too. 
            
            // probably should do an error check here and then:
            //   if (err) {reject(err); } 
            
            resolve(data);
            return;
            
        }
        
        Tabletop.init(options);
        
    });
}
