# **Tabletop.js** (gives spreadsheets legs)

**Tabletop.js** takes a Google Spreadsheet and makes it easily accessible through JavaScript. With zero dependencies!

Tabletop.js easily integrates Google Spreadsheets with Backbone.js, Handlebars, and anything else that is hip and cool. It will also help you make new friends and play jazz piano.

### Like how easy?

    function init() {
      Tabletop.init( { key: '0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE',
                       callback: function(data, tabletop) { console.log(data) },
                       simpleSheet: true } )
    }

Will give you

    [ { name: "Carrot", category: "Vegetable", healthiness: "Adequate" }, 
      { name: "Pork Shoulder", category: "Meat", healthiness: "Questionable" }, 
      { name: "Bubblegum", category: "Candy", healthiness: "Super High"} ]

Yes, that easy.

## Notes

### To existing users: things have changed!

Not too much, though.

We now support multiple instances of Tabletop, so no more `Tabletop.sheets('Cats')`. You'll want to assign your init to a variable and use <em>that</em>. Take a look at the examples, it's not too tough to switch over.

## Getting Started

### 1) Getting your data out there

_The first step is to get your data out into a form Tabletop can digest_

Take a Google Spreadsheet. Give it some column headers, give it some content.

    Name            Category   Healthiness
    Carrot          Vegetable  Adequate
    Pork Shoulder   Meat       Questionable
    Bubblegum       Candy      Super High
  
In Google Docs, then go up to the `File` menu and pick `Publish to the web`. Fiddle with whatever you want, then click `Start publishing`. A URL will appear, something like `https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html`

Copy that! In theory you're interested in the part between `key=` and `&` but you can use the whole thing if you want.

### 2) Setting up Tabletop

_Now you're going to feed your spreadsheet into Tabletop_

Include Tabletop in your HTML, then try the following, substituting your URL for `public_spreadsheet_url`

    <script type="text/javascript">
      window.onload = function() { init() };
    
      var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html';

      function init() {
        Tabletop.init( { key: public_spreadsheet_url,
                         callback: showInfo,
                         simpleSheet: true } )
      }

      function showInfo(data, tabletop) {
        alert("Successfully processed!")
        console.log(data);
      }
    </script>

Open up your console and check out the data that you got. All of those rows were turned right into objects! **See how easy that was?** 

Please don't hold`window.onload` against me, you're free to use `$(document).ready` and all of that jQuery jazz.

### 3) Honestly, that's it.

Check out the reference and the examples, but basically you're set. The only thing to think about right _now_ is if you want to deal with multiple sheets you can get rid of `simpleSheet: true` (more on that later).

You might also be interested in the publishing/republishing/publish-as-it-changes aspects of Google Spreadsheets, but you'll need to google that for any specifics.

# Reference

## The Moving Parts

### Tabletop initialization

The simplest Tabletop initialization works like this

    var tabletop = Tabletop.init( { key: public_spreadsheet_url, callback: showInfo } )
  
With a function living somewhere else called `showInfo`.

You pass in either `key` as the actual spreadsheet key, or just the full published-spreadsheet URL. It calls showInfo when done, passing an array of models. Options in general are

`key` is the key of the published spreadsheet or the URL of the published spreadsheet.

`callback` is the callback for when the data has been successfully pulled. It will be passed an object containing the models found in the spreadsheet (worksheets => models), and the tabletop instance. Each of these models contains the rows on that worksheet (see Tabletop.Model). If simpleSheet is turned on it simply receives an array of rows of the first worksheet.

`simpleSheet` can be true or false (default false). It assumes you have one table and you don't care what it's called, so it sends the callback an array of rows instead of a list of models. Peek at the examples for more info.

`parseNumbers` can be true or false (default false). If true, Tabletop will automatically parse any numbers for you so they don't run around as strings.

`postProcess` is a function that processes each row after it has been created. Use this to rename columns, compute attributes, etc. See the TimelineSetter example below.

`wanted` is an array of sheets you'd like to pull. If you have 20 sheets in a public spreadsheet you might as well only pull what you need to access. See the example in simple/multiple.html. Defaults to all.

`wait` prevents tabletop from pulling the Google spreadsheet until you're ready. Used in the backbone.js example.

### Tabletop itself

Once you've initialized a `tabletop` object you can access its good parts.

`.sheets()` are the `Tabletop.Model`s that were populated, one per worksheet. You access a sheet by its name. 

`.sheets(name)` is how you access a specific sheet. Say I have a worksheet called **Cats I Know**, I'll access it via `tabletop.sheets("Cats I Know")`

`.model_names` are the names of the models [read: sheets] that Tabletop knows about

`.data()` returns the rows of the first model if you're in simpleSheet mode. It's the same as `.sheets()` otherwise. This is just a little sugar.

`.fetch()` manually initializes a pulling of the data

`.addWanted(name)` adds a sheet to the list that are updated with `.fetch`

### Tabletop.Model

Tabletop.Model is pretty boring, let's be honest.

`.name` is the name of the worksheet it came from (the tab at the bottom of the spreadsheet)

`.column_names` gives you the names of the columns in that table

`.all()` returns an array of the rows of the table, in the style of `[ { name: "Tom", age: 5}, { name: "Liz", age: 12 } ]`

`.toArray()` returns the rows of the table with numbered indices instead of named ones [ [ "Tom", 5] , [ "Liz", 12 ] ]

## What the hell do I do with this?

Imagine it's a read-only, JavaScript CMS that you can edit through Google Docs. It's like _Christmas_ up in here.

### Working with Tabletop and Handlebars

Super easy. Just feed the models to Handlebars and you're all set to build the templates.

### Working with Tabletop and Backbone.js

I've put together a Backbone.tabletopSync driver for Backbone collections and models. It's read-only, but you can't really complain if you're powering your Backbone app through Google Spreadsheets.

Source is, of course, in `/src`, and you can check it out in action in `/examples/backbone/`

### Working with Tabletop and TimelineSetter

Tabletop was originally built to work with ProPublica's <a href="http://propublica.github.com/timeline-setter/">TimelineSetter</a>, a JS+Ruby library that creates timelines. You need some specifically-formatted JSON which is created by a Ruby script from a CSV, which means your workflow is usually spreadsheet -> CSV -> Ruby -> JSON -> JS.

With Tabletop, though, you get to hook right into a Google Spreadsheet for all of your info! You just need to massage your data a _little_ bit, thanks to Google's API messing with column names and you needing a timestamp.

You can see this in the examples directory, but here are the important parts.

    <script type="text/javascript">
      var public_spreadsheet_url = "https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdHk2akhfdG5iTk96OUt6UjJJX1dYMFE&single=true&gid=0&output=html"

      $(document).ready( function() {
         /* 
          Need to post-process elements because Google Spreadsheets abbreviates 
            'display_date' column as 'displaydate' and you need to parse the date
            into the 'timestamp' field for TimelineSetter
          simpleSheet: true sends array of rows to callback, so you don't need to
            do the whole Tabletop.sheets('Sheet1').all() thing.
        */
        Tabletop.init( { key: public_spreadsheet_url,
                         callback: drawTimeline,
                         simpleSheet: true,
                         postProcess: function(element) {
                           element["display_date"] = element["displaydate"];
                           element["timestamp"] = Date.parse( element["date"] );
                         } 
        })
      })
    
      function drawTimeline(data, tabletop) {
        var currentTimeline = TimelineSetter.Timeline.boot(
          data,
          {"container":"#timeline","interval":""}
        );
      }
    </script>

See the `postProcess` call? That's called on every row after Tabletop.Model gets done working on it. It allows you to rename columns or edit data points without having to messily do it outside of Tabletop. I'm sure it has uses outside of TimelineSetter, too.

A sample lives in `/examples/timeline_setter/`

# Notes

## Bugs and TODO

Let me know what you need, I have no clue.

## Credits

<a href="http://twitter.com/dangerscarf">Jonathan Soma</a>, who would rather be cooking than coding. Inspired by the relentless demands of <a href="https://twitter.com/jkeefe">John Keefe</a> of WNYC.

Thanks to <a href="https://github.com/plainview">Scott Seaward</a> for implementing multi-instance Tabletop.