function Tracker(sites) {
  this._sites = sites;
  var tabToUrl,url;
  var self = this;
  if (!localStorage.tabToUrl) {
    localStorage.tabToUrl = JSON.stringify({});
  }
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // This tab has updated, but it may not be on focus.
      // It is more reliable to request the current tab URL.
      tabToUrl=self.tabToUrl;
      if(tabToUrl[tabId]){
      if(tabToUrl[tabId]!=tab.url){
        self._sites.updateSites(tabToUrl[tabId],tab.url);
        tabToUrl[tabId]=tab.url;
        localStorage.tabToUrl =JSON.stringify(tabToUrl);
      }
    }
      else{
        self._sites.updateSites(null,tab.url);
        tabToUrl[tabId]=tab.url;
        localStorage.tabToUrl =JSON.stringify(tabToUrl);
      }
      self._updateTimeWithCurrentTab();
    }
  );
  chrome.tabs.onActivated.addListener(

    function(activeInfo) {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        self._sites.setCurrentFocus(tab.url);
      });
    }
  );
  chrome.windows.onFocusChanged.addListener(
    function(windowId) {
      if (windowId == chrome.windows.WINDOW_ID_NONE) {
        self._sites.setCurrentFocus(null);
        return;
      }
      self._updateTimeWithCurrentTab();
    }
  );
  chrome.tabs.onRemoved.addListener(function(tabId, info) {
    self._sites.setTabRemove(true);
    tabToUrl=self.tabToUrl;
    url=tabToUrl[tabId];
    var sites=JSON.parse(localStorage.sites);
    console.log(url+" closed "+"after running for "+sites[url]);
    self._sites.updateSites(tabToUrl[tabId],null)
    delete tabToUrl[tabId];
    localStorage.tabToUrl= JSON.stringify(tabToUrl);

  });
}

Object.defineProperty(Tracker.prototype, "tabToUrl", {
  get: function() {
    var t = JSON.parse(localStorage.tabToUrl);
    var tabToUrl = {};
    for (var tab in t) {
      if (t.hasOwnProperty(tab)) {
        tabToUrl[tab] = t[tab];
      }
    }
    return tabToUrl;
  }
});


Tracker.prototype._updateTimeWithCurrentTab = function() {
  var self = this;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      // Is the tab in the currently focused window? If not, assume Chrome
      // is out of focus. Although we ask for the lastFocusedWindow, it's
      // possible for that window to go out of focus quickly. If we don't do
      // this, we risk counting time towards a tab while the user is outside of
      // Chrome altogether.
      var url = tabs[0].url;
      chrome.windows.get(tabs[0].windowId, function(win) {
        if (!win.focused) {
          url = null;
        }
        self._sites.setCurrentFocus(url);
      });
    }
  });
};
