/* 
  A drop-in read-only Google-Spreadsheets-backed replacement for Backbone.sync

  Tabletop must be successfully initialized prior to using fetch()

  Backbone.tabletopSync only supports the 'read' method, and will fail
    loudly on any other operations
*/

Backbone.tabletopSync = function(method, model, options, error) {
  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }
  
  var resp;

  var sheet = Tabletop.sheets( model.sheetName );
  
  switch (method) {
    case "read":
      if(model.id) {
        resp = _.find( sheet.all(), function(item) {
          return model.id == item[model.idAttribute];
        }, this);
      } else {
        resp = sheet.all();
      }
      break;
    default:
      throw("Backbone.tabletopSync is read-only");
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};