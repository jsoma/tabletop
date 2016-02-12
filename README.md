# **Tabletop.js** (gives spreadsheets legs)

**Tabletop.js** takes a Google Spreadsheet and makes it easily accessible through JavaScript. With zero dependencies! If you've ever wanted to get JSON from a Google Spreadsheet without jumping through a thousand hoops, welcome home.

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

## Getting Started

You might have seen some instructions on [http://builtbybalance.com/Tabletop/](http://builtbybalance.com/Tabletop/), but please ignore them, because they're *super super out of date*. Probably don't *break* anything, but they sure ain't current (not my domain, can't take them down). These docs here are the most up-to-date, so treat them as the gospel truth!

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

`orderby` asks Google to sort the results by a column. You'll need to strip spaces and lowercase your column names, i.e. `{order: 'firstname'}` for a column called **First Name**. You'll want to use this when you only have a single sheet, though, otherwise it will try to sort by the same column on every single sheet.

`reverse` reverses the order if set to true.

`postProcess` is a function that processes each row after it has been created. Use this to rename columns, compute attributes, etc. See the TimelineSetter example below.

`wanted` is an array of sheets you'd like to pull. If you have 20 sheets in a public spreadsheet you might as well only pull what you need to access. See the example in simple/multiple.html. Defaults to all.

`endpoint` is the protocol and domain you'd like to query for your spreadsheet. Defaults to `https://spreadsheets.google.com`.

`singleton` assigned the instantiated Tabletop object to Tabletop.singleton, implemented to simplify caching and proxying of requests. Defaults to `false`.

`simple_url`, if true, changes all requests to `KEY` and `KEY-SHEET_ID`. Defaults to `false`.

`proxy` allows you to easily use spreadsheets not located on Google Spreadsheet servers. Setting `proxy: "http://www.proxy.com"` is equivalent to setting `{ simple_url: true, singleton: true, endpoint: "http://www.proxy.com" }`. [Flatware](https://github.com/jsoma/flatware) might provide better documentation.

`wait` prevents tabletop from pulling the Google spreadsheet until you're ready. Used in the backbone.js example.

`query` sends a [structured query](https://developers.google.com/google-apps/spreadsheets/#sending_a_structured_query_for_rows) along with the spreadsheet request, so you can ask for rows with `age > 55` and the like. Right now it's passed with *every request*, though, so if you're using multiple tables you'll end up in Problem City. It should work great with `simpleSheet` situations, though.

`debug` returns on debug mode, which gives you plenty of messaging about what's going on under the hood.

`parameterize` changes the src of all injected scripts. Instead of `src`, `src` is URI encoded and appended to `parameterize`, e.g. set it to `http://example.herokuapp.com/?url=`. Mostly for [gs-proxy](https://github.com/MinnPost/gs-proxy).

`callbackContext` sets the `this` for your callback. It's the tabletop object by default.

`prettyColumnNames` can be true or false (default to true, unless `proxy` is enabled**). Since Google doesn't pass us exactly the same column names as in the header ('$ Processed' becomes 'processed'), it takes an extra request to correct them. If you don't want the extra request, you'll want to set it to `false`

> See the **unfriendly_headers** example for more info. Only works for newer Google Sheets.

> ** prettyColumnNames doesn't work with [Flatware](https://github.com/jsoma/flatware), is why we disable it with a proxy by default

### Tabletop itself

Once you've initialized a `tabletop` object you can access its good parts.

`.sheets()` are the `Tabletop.Model`s that were populated, one per worksheet. You access a sheet by its name. 

`.sheets(name)` is how you access a specific sheet. Say I have a worksheet called **Cats I Know**, I'll access it via `tabletop.sheets("Cats I Know")`

`.model_names` are the names of the models [read: sheets] that Tabletop knows about. The sheet names do *not* reflect their ordering in the original spreadsheet.

`.foundSheetNames` are the names of the sheets [read: models] that Tabletop knows about. Their order reflects the sheets' order in the original spreadsheet.

`.data()` returns the rows of the first model if you're in simpleSheet mode. It's the same as `.sheets()` otherwise. This is just a little sugar.

`.fetch()` manually initializes a pulling of the data

`.addWanted(name)` adds a sheet to the list that are updated with `.fetch`

### Tabletop.Model

Tabletop.Model is pretty boring, let's be honest.

`.name` is the name of the worksheet it came from (the tab at the bottom of the spreadsheet)

`.column_names` gives you the names of the columns in that table

`.original_columns` gives you the names of the columns that Google sends on the first pass (numbers stripped, lowercase, etc)

`.pretty_columns` gives you the mapping between the column headers in the spreadsheet and the and the `column_names`. Disabled by passing `prettyColumnNames: false` when initializing Tabletop.

`.all()` returns an array of the rows of the table, in the style of `[ { name: "Tom", age: 5}, { name: "Liz", age: 12 } ]`

`.toArray()` returns the rows of the table with numbered indices instead of named ones [ [ "Tom", 5] , [ "Liz", 12 ] ]

## What the hell do I do with this?

Imagine it's a read-only, JavaScript CMS that you can edit through Google Docs. It's like _Christmas_ up in here.

### Working with Tabletop and Handlebars

Super easy. Just feed the models to Handlebars and you're all set to build the templates.

### Working with Tabletop and Backbone.js

I've put together a Backbone.tabletopSync driver for Backbone collections and models. It's read-only, but you can't really complain if you're powering your Backbone app through Google Spreadsheets.

Source is, of course, in `/src`, and you can check it out in action in `/examples/backbone/`

### Working with Tabletop and AngularJS

[Ændrew Rininsland (@aendrew)](http://www.github.com/aendrew) at [The Times and Sunday Times](http://www.github.com/times) has created a module that makes using Tabletop with [AngularJS](http://www.angularjs.org) extremely easy. It also includes a loader for  [angular-translate](https://angular-translate.github.io) that gives Tabletop the ability to provide i18n translation strings.

Please see [times/angular-tabletop](http://www.github.com/times/angular-tabletop) for more details.

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

## Caching/Proxying Google Spreadsheets

Yeah, Google Spreadsheets can sometimes be slow or sometimes be overwhelmed or *maybe* one day Google will just up and disappear on us. So Tabletop.js now supports fetching your data from elsewhere, using options like `endpoint` and `proxy`.

`proxy` is the fun one, in that it rewrites your requests to be simpler-looking and plays nicely with the app & example I put together.

### Using Flatware

If you don't mind running around with Heroku and AWS, [Flatware](https://github.com/jsoma/flatware) is an app I built that uploads the spreadsheet JSON response to S3.

### Using table-service

[table-service](https://github.com/martinburch/table-service) hosts it on your own server using a python script, and auto-updates thanks to a tiny script you add to your spreadsheet.

### Using gs-proxy

[gs-proxy](https://github.com/MinnPost/gs-proxy) is another option that also uses Heroku. You'll set `parameterize` to something like `http://example.herokuapp.com/?url=` and off you go!

### Using other caching

You can point `proxy` at anything you'd like as long as it has `KEY` and `KEY-SHEET_ID` files sitting in a directory. Feel free to host it on your own server! You can use `/caching/local.rb` if you want a pretty easy solution for generating the flat files.

# Notes

## Strange behavior

**Empty tables are trouble.** We can't get column names from them (c'mon, Google!), so don't be too confused when a table with 0 rows is coming back with an empty `.column_names` or your code starts throwing weird errors when processing the results.

**Empty rows are trouble.** If you have a row that's completely empty, Google doesn't return any rows after the empty row. As a result, you need to make sure every line in your spreadsheet has data in it.

## If you are having trouble

Turn on debugging by passing `debug: true` when you initialize Tabletop. Check out the console, I try to keep my error messages chatty and informative. Or just email me at [jonathan.soma@gmail.com](mailto:jonathan.soma@gmail.com), I'm happy to help!

## Tabletop.js in the wild

**The more examples the better, right?** Feel free to fork or contact me if you have a good example of something you've done.

A [contextual video player](http://www.aljazeera.com/indepth/interactive/2012/04/20124107156511888.html) with [popcorn.js](http://popcornjs.org) by [@maboa](https://twitter.com/maboa) 

The [WNYC mayoral tracker](http://project.wnyc.org/elections/mayor-tracker/) uses Tabletop along with [Backbone.js](http://backbonejs.org)

A [Facebook-esque timeline](http://builtbybalance.com/github-timeline/) from [Balance Media](http://builtbybalance.com) (with a [git repo](https://github.com/balancemedia/Timeline))

[Mapsheet](https://github.com/jsoma/mapsheet) creates super easy, customizable maps.

## Other Options

If you aren't really feeling Tabletop, you should give [Dataset](http://misoproject.com/dataset/) a shot. It's "a JavaScript client-side data transformation and management library," which means it does a hell of a lot more than our dear Tabletop.

## Credits

[Jonathan Soma](http://twitter.com/dangerscarf), who would rather be cooking than coding. Inspired by the relentless demands of [John Keefe](https://twitter.com/jkeefe) of WNYC.

Thanks to [Scott Seaward](https://github.com/plainview) for implementing multi-instance Tabletop.

[Alan Palazzolo](https://github.com/zzolo) hooked the world up with [gs-proxy](https://github.com/MinnPost/gs-proxy) and added support for it into Tabletop via `parameterize`

[Max Ogden](https://github.com/maxogden) was kind enough to lend Tabletop nodejs support as part of an [Open News](http://www.mozillaopennews.org) [code sprint](http://www.mozillaopennews.org/codesprints.html)
