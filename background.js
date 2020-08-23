const CSSTvShow = ".volatile-billboard-animations-container .billboard-row { position: absolute; opacity: 0; }";
const CSSMovies = ".bigRow { position: absolute; opacity: 0; }";
const CSSTvShowContinueWatching = "[data-list-context='continueWatching'] { position: fixed; opacity: 0;}";
const TITLE_APPLY = "Active";
const TITLE_REMOVE = "Inactive";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
function toggleCSS(tab) {

  function gotTitle(title) {
    if (title === TITLE_REMOVE) {
      browser.pageAction.setIcon({tabId: tab.id, path: "icons/netflixActive-19.jpg"});
      browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
      browser.tabs.insertCSS({code: CSSTvShow});
      browser.tabs.insertCSS({code: CSSTvShowContinueWatching});
      browser.tabs.insertCSS({code: CSSMovies});


    } else {
      browser.pageAction.setIcon({tabId: tab.id, path: "icons/netflixPassive-19.jpg"});
      browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
      browser.tabs.removeCSS({code: CSSTvShow});
      browser.tabs.removeCSS({code: CSSTvShowContinueWatching});
      browser.tabs.removeCSS({code: CSSMovies});
    }
  }

  var gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
  gettingTitle.then(gotTitle);
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
function protocolIsApplicable(url) {
  var anchor =  document.createElement('a');
  anchor.href = url;
  return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  
  if (protocolIsApplicable(tab.url)) {
      browser.pageAction.setIcon({tabId: tab.id, path: "icons/netflixPassive-19.jpg"});
      browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
      browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});

gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Toggle CSS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleCSS);