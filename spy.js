// Find out the friends of a friend, although they are private.
// How to:
// Step 1: Go to the profile on a friend
// Step 2: Manually scroll down the page. The more you scroll, the more friends you find out
// Step 3: Open the javascript console
// Step 4: Paste jQuery code
// Step 5: Paste this file
// Step 6: write "outputFriends()" into the console


// copied from stackoverflow.com
function uniq_fast(a) {
  var seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
    var item = a[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

function getLinksToLikeLists(likeListSelector) {
  var links = [];
  var likes = $(likeListSelector);
  for (var i = 0; i < likes.length; ++i) {
    links.push(likes[i].href);
    //links.push(likes[i].getAttribute("ajaxify"));
  }
  return links;
}

function scrapeUsernamesInLikeList(html, profileSelector) {
  var usernames = [];
  var profiles = $(profileSelector, html);
  for (var i = 0; i < profiles.length; ++i) {
    var username = profiles[i].innerHTML;
    usernames.push(username);
  }
  return usernames;
}

function cleanUpMessInUsernames(usernames) {
  for (var i=0; i < usernames.length; i++) {
    //filter out <img ... or some weird object
    if (usernames[i][0] === '<' || typeof usernames[i] !== 'string') {
      usernames.splice(i, 1);
    }
  }
  return usernames;
}

function accumulateUsernamesFromLikeList(uri, profileSelector) {
  $.ajax({url:uri}).done(function(data) {
    var usernames = scrapeUsernamesInLikeList(data, profileSelector);

    // used only because scrapeUsernamesInLikeList has poor selector
    // and selects more than needed
    usernames = cleanUpMessInUsernames(usernames);

    ALL_USERNAMES = uniq_fast(ALL_USERNAMES.concat(usernames));
  });
}

function outputFriends() {
  console.log("altogether" + ALL_USERNAMES.length + "friends found")
  return ALL_USERNAMES.sort().join();
}
var ALL_USERNAMES = [];
var likeLists = getLinksToLikeLists("a[href*='browse/likes']");
for (var i = 0; i < likeLists.length; ++i) {
  accumulateUsernamesFromLikeList(likeLists[i], "a[href*='profile_browser']");
}

