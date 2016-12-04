/*
# Setup
## Set Script Properties:
access_token: Your weibo access token.  Hard to get :)

## Prepare Sheet
Rename the first sheet to `statuses`
*/

function fetch() {
  fetchRepost("4047537360890358");
}

function fetchRepost(id) {
  var page = 1; // Initial: 1
  var total = 0; // Initial: 0
  var total_number = 1;
  
  for (page; total < total_number; page++) {   
    var response = requestWeiboRepost(id, page);
    var json = response.getContentText();
    var data = JSON.parse(json);
    var statuses = data.statuses;
    total_number = data.total_number;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Statuses");
    if (statuses.length > 0) {
      ss.toast("Inserting "+ (total + 1) + " - " + (total + statuses.length) +" rows");
      var range = sheet.getRange(total + 1, 1, statuses.length, 1);
      var values = [];
      for (i = 0; i < statuses.length; i++) {
        var value = [];
        value.push(statuses[i]);
        values.push(value);
      }
      range.setValues(values);
    } else {
      ss.toast("All done");
    }
    total = total + statuses.length;
    Logger.log("Fetched " + total + "/" + total_number);
  }
}

function requestWeiboRepost(id, page) {
  var properties = PropertiesService.getScriptProperties();
  var access_token = properties.getProperty("access_token");
  var url = ["https://api.weibo.com/2/statuses/repost_timeline/ids.json?",
            'access_token=', access_token,
            '&id=', id,
            '&page=', page].join('');
  Logger.log("Beginning fetching page " + page + "...");
  return UrlFetchApp.fetch(url);
}
