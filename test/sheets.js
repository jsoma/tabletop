var Tabletop = require('../src/tabletop')
var TabletopMin = require('../src/tabletop.min')
var assert = require('assert');

var sheets = {
  '2011': 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE&output=html',
  '2014': 'https://docs.google.com/spreadsheets/d/1Vmj7tj64bz1cFRnbCJCAAXufonxIVOKqhZDTfPOvFTU/pubhtml',
  '2016': 'https://docs.google.com/spreadsheets/d/1sbyMINQHPsJctjAtMW0lCfLrcpMqoGMOJj6AN-sNQrc/pubhtml'
}

function testTabletop(Tabletop) {
  describe('2011-ish era spreadsheets', function() {
    it('pulls in a single spreadsheet', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2011'],
        callback: function(data, tabletop) {
          assert(data.length, 3, '3 rows were pulled in')
          done()
        },
        simpleSheet: true
      })
    })

    it('pulls in a multiple spreadsheets', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2011'],
        callback: function(data, tabletop) {
          assert(tabletop.sheets('Sheet1'), 'can access Sheet1')
          done()
        }
      })
    })
  });

  describe('2014-ish era spreadsheets', function() {
    it('pulls in a single spreadsheet', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2014'],
        callback: function(data, tabletop) {
          assert(data.length, 2, '2 rows were pulled in')
          done()
        },
        simpleSheet: true
      })
    })

    it('pulls in a multiple spreadsheets', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2014'],
        callback: function(data, tabletop) {
          assert(tabletop.sheets('Sheet1'), 'can access Sheet1')
          done()
        }
      })
    })
  });


  describe('2016-ish era spreadsheets', function() {
    it('pulls in a single spreadsheet', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2016'],
        callback: function(data, tabletop) {
          assert(data.length, 4, '4 rows were pulled in')
          done()
        },
        simpleSheet: true
      })
    })

    it('pulls in a multiple spreadsheets', function(done) {
      var tabletop = Tabletop.init({
        key: sheets['2016'],
        callback: function(data, tabletop) {
          assert(tabletop.sheets('books'), 'can access books')
          done()
        },
        simpleSheet: true
      })
    })
  });
}

describe("Non-minified Tabletop", function() {
  testTabletop(Tabletop)
})

describe("Minified Tabletop", function() {
  testTabletop(TabletopMin)
})
