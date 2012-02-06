(function(global) {

  /*
    Initialize with Tabletop.init( { key: '0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc' } )
      OR!
    Initialize with Tabletop.init( { key: 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc&output=html&widget=true' } )
      OR!
    Initialize with Tabletop.init('0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc')
  */

  "use strict";

  var Tabletop = global.Tabletop = function(options) {
    if(!this || this === global) {
      return new Tabletop(options);
    }

    if(typeof(options) == 'string') {
      options = { key : options };
    }

    this.callback = options.callback;
    this.key = options.key;
    this.simpleSheet = !!options.simpleSheet;
    this.parseNumbers = !!options.parseNumbers;
    this.postProcess = options.postProcess;
    this.debug = !!options.debug;

    /* Be friendly about what you accept */
    if(/key=/.test(this.key)) {
      if(this.debug)
        console.debug("You passed a key as a URL! Attempting to parse.");

      this.key = this.key.match("key=(.*?)&")[1];
    }

    if(!this.key) {
      alert("You need to pass Tabletop a key!");
      return;
    }

    if(this.debug)
      console.debug("Initializing with key %s", this.key);

    this.models = {};
    this.model_names = [];

    var json_url = "https://spreadsheets.google.com/feeds/worksheets/" + this.key + "/public/basic?alt=json-in-script";

    this.injectScript(json_url, this.loadSheets);
  };

  Tabletop.callbacks = {};

  Tabletop.init = function(options) {
    return new Tabletop(options);
  };

  Tabletop.prototype = {

    /*
      Insert the URL into the page as a script tag. Once it's loaded the spreadsheet data
      it triggers the callback. This helps you avoid cross-domain errors
      http://code.google.com/apis/gdata/samples/spreadsheet_sample.html

      Let's be plain-Jane and not use jQuery or anything.
    */
    injectScript: function(url, callback) {
      var script = document.createElement('script'),
          self = this,
          callbackName = 'tt' + (+new Date()) + (Math.floor(Math.random()*100000));
      Tabletop.callbacks[ callbackName ] = function () {
        var args = Array.prototype.slice.call( arguments, 0 );
        callback.apply(self, args);
        script.parentNode.removeChild(script);
        delete Tabletop.callbacks[callbackName];
      };
      url = url + "&callback=" + 'Tabletop.callbacks.' + callbackName;
      script.src = url;
      document.getElementsByTagName('script')[0].parentNode.appendChild(script);
    },

    /*
      What gets send to the callback
      if simpleSheet == true, then don't return an array of Tabletop.this.models,
      only return the first one's elements
    */
    data: function() {
      if(this.model_names.length === 0) {
        return undefined;
      }
      if(this.simpleSheet) {
        if(this.model_names.length > 1 && this.debug)
          console.debug("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong.");
        return this.models[ this.model_names[0] ].all();
      } else {
        return this.models;
      }
    },

    /*
      Load all worksheets of the spreadsheet, turning each into a Tabletop Model.
      Need to use injectScript because the worksheet view that you're working from
      doesn't actually include the data. The list-based feed (/feeds/list/key..) does, though.
      Calls back to loadSheet in order to get the real work done.

      Used as a callback for the worksheet-based JSON
    */
    loadSheets: function(data) {
      var i;
      this.sheetsToLoad = data.feed.entry.length;
      for(i = 0; i < data.feed.entry.length; i++) {
        var sheet_id = data.feed.entry[i].link[3].href.substr(-3, 3);
        var json_url = "https://spreadsheets.google.com/feeds/list/" + this.key + "/" + sheet_id + "/public/values?alt=json-in-script";
        this.injectScript(json_url, this.loadSheet);
      }
    },

    /*
      Access layer for the this.models
      .sheets() gets you all of the sheets
      .sheets('Sheet1') gets you the sheet named Sheet1
    */
    sheets: function(sheetName) {
      if(typeof sheetName === "undefined")
        return this.models;
      else
        return this.models[ sheetName ];
    },

    /*
      Parse a single list-based worksheet, turning it into a Tabletop Model

      Used as a callback for the list-based JSON
    */
    loadSheet: function(data) {
      var model = new Tabletop.Model( { data: data, 
                                    parseNumbers: this.parseNumbers,
                                    postProcess: this.postProcess } );
      this.models[ model.name ] = model;
      this.model_names.push(model.name);
      this.sheetsToLoad--;
      if(this.sheetsToLoad === 0)
        this.doCallback();
    },

    /*
      Execute the callback upon loading! Rely on this.data() because you might
        only request certain pieces of data (i.e. simpleSheet mode)
      Tests this.sheetsToLoad just in case a race condition happens to show up
    */
    doCallback: function() {
      if(this.sheetsToLoad === 0)
        this.callback(this.data());
    }
  };

  /*
    Tabletop.Model stores the attribute names and parses the worksheet data
      to turn it into something worthwhile

    Options should be in the format { data: XXX }, with XXX being the list-based worksheet
  */
  Tabletop.Model = function(options) {
    var i, j;
    this.column_names = [];
    this.name = options.data.feed.title.$t;
    this.elements = [];

    for(var key in options.data.feed.entry[0]){
      if(/^gsx/.test(key))
        this.column_names.push( key.replace("gsx$","") );
    }

    for(i = 0; i < options.data.feed.entry.length; i++) {
      var source = options.data.feed.entry[i];
      var element = {};

      for(j = 0; j < this.column_names.length; j++) {
        var cell = source[ "gsx$" + this.column_names[j] ];
        if(options.parseNumbers && cell.$t !== '' && !isNaN(cell.$t))
          element[ this.column_names[j] ] = +cell.$t;
        else
          element[ this.column_names[j] ] = cell.$t;
      }
      if(element.rowNumber === undefined)
        element.rowNumber = i + 1;
      if( options.postProcess )
        options.postProcess(element);
      this.elements.push(element);
    }

  };

  Tabletop.Model.prototype = {
    /*
      Returns all of the elements (rows) of the worksheet as objects
    */
    all: function() {
      return this.elements;
    },

    /*
      Return the elements as an array of arrays, instead of an array of objects
    */
    toArray: function() {
      var array = [],
          i, j;
      for(i = 0; i < this.elements.length; i++) {
        var row = [];
        for(j = 0; j < this.column_names.length; j++) {
          row.push( this.elements[i][ this.column_names[j] ] );
        }
        array.push(row);
      }
      return array;
    }
  };

})(this);
