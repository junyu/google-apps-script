# google-apps-script
A few misc scripts I wrote for my own convenience.

## Mark Feedbin As Unread

This script uses Feedbin API to download allentries the user subscribes to, and mark all as unread.  This in my own use case, is to undo the occassion annoying "Mark all as read" operation.  I never want to mark all as read.  I have to read everything :(

1. Create a new Google Spreadsheet at [https://sheets.google.com], then rename the first sheet as `Entries`. Make sure the sheet is long enough.
2. For your own convenience, name the first row as:
  * `id`
  * `feed_id`
  * `title`
  * `url`
  * `author`
  * `published`
  * `created_at`
2. "Tools" -> "Script Editor";
3. Choose "Blank Project", and paste `unread-feedbin.gs` into the Web IDE.
4. Press Ctrl-S or Command-S, give the project a name you like.
5. "File" -> "Project properties", then "Script Propertieis".
6. Create two entries:
  * `username`: Your Feedbin username, should be an email address.
  * `password`: Your Feedbin password.
7. In Line 24, there is a `maxPage` that is default to `500`.  That means we will fetch 500 * 100 entries.  Change that if you don't want to do so many.
8. In the toolbar, select `fetch` in the "Function" dropdown, click "Run", then follow the authorization process;
9. You could watch the entries fill up your spreadsheet... If the script "exceeds execution time", go to "View" -> "Logs" to see the progress.  Just copy the numbers in last two logs to Line 22 (`page`) and Line 23 (`total`), and repeat step 8 again.
10. After you fetch enough entries, switch to `markAsUnread` in the "Function" dropdown, and click "Run".
11. You should have marked all entries as unread in Feedbin now.

## Fetch Weibo Repost

This script uses Weibo API to fetch all repost for a given Weibo to Sheet.

1. Create a new Google Sheet at [https://sheets.google.com], then rename the first sheet as `Statuses`.
2. Figure out your Weibo `access_token` and the Weibo ID you want to fetch.  So easy as Weibo has excellent documentation.
3. "Tools" -> "Script Editor";
4. Choose "Blank Project", and paste `fetch-weibo-repost.gs` into the IDS.
5. "File" -> "Project properties", then "Script Properties".
6. Create an entry: `access_token`, and put in your access token.
7. Change line 11 to the ID you want to fetch.
8. In the toolbar, select `fetch` in the "Function" dropdown, click "Run", and follow the authorization process if first time run.
9. Just wait.
