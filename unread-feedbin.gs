/*
# Setup

## Set User Properties:

username: Your username at Feedbin. Should be an email address.
password: Your password.
  
## Prepare spreadsheet:
  1. Long enough
  2. Have header like this: id, feed_id, title, url, author, published, created_at
  
## Timeout

It might timeout if your subscription is long.  In that case, open View => Logs, see 
the page it executed to, and set it as the beginning.

## Feedbin only keeps unread status in the last 60 days.  But anyway this is a good way to build an archive of your feedbin subscriptions.
*/

function fetch() {
  var page = 1; // Initial: 1
  var total = 0; // Initial: 0
  var maxPage = 500;
  
  for (page; page <= maxPage; page++) {
    Logger.log("Beginning page " + page + "...");
    
    var response = requestFeedbin("/v2/entries.json?page=" + page, "GET");
    var json = response.getContentText();
    var entries = JSON.parse(json);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Entries");
    if (entries.length > 0) {
      ss.toast("Inserting "+ (total + 1) + " - " + (total + entries.length) +" rows");
      
      var data = [];
      for (var i = 0; i < entries.length; i++) {
        var values = []
        // Push in following order: id, feed_id, title, url, author, published, created_at
        values.push(entries[i].id, entries[i].feed_id, entries[i].title, entries[i].url,
            entries[i].author, entries[i].published, entries[i].created_at);
        data.push(values);
      }
      var range = sheet.getRange(total + 2, 1, entries.length, 7); // 7 columns.
      range.setValues(data);
    } else {
      ss.toast("All done");
    }  
    total = total + entries.length;
    Logger.log("Finish total " + total + ".");
  }
}

function markAsUnread() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Entries");
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(2, 1, lastRow - 1, 1);
  var values = range.getValues();
  var ids = [];
  for (var i = 0; i < values.length; i++) {
    ids.push(values[i][0]); // There is only one col.
  }
  Logger.log("There is " + ids.length + " entries to mark as unread...");
  // Feedbin requires us to do 1000 per batch
  for (var j = 0; j * 1000 < values.length; j++) {
    Logger.log("Sending batch #" + j + ", from # " + ids[j] + "to #" + ids[j + 1000] + "...");
    batch = ids.slice(j * 1000, j * 1000 + 1000);
    var payload = '{"unread_entries": [' + batch.join(", ") + ']}';
    var response = requestFeedbin("/v2/unread_entries.json", "POST", payload);
    Logger.log(response);
  }
}

function requestFeedbin(url, method, opt_payload) {
  var properties = PropertiesService.getScriptProperties();
  var username = properties.getProperty("username");
  var password = properties.getProperty("password");
  Logger.log("Beginning communicating feedbin for " + username + "...");
  var headers = {"Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)};
  var params = {
    "method": method,
    "headers":headers
  };
  if (opt_payload) {
    params.payload = opt_payload;
    params.contentType = "application/json";
  }
  return UrlFetchApp.fetch("https://api.feedbin.com" + url, params);
}
