

function Tracker() {
  if (!localStorage.tabToUrl) {
    localStorage.tabToUrl = JSON.stringify([]);
  }
  var tabToUrl=[];
  var self=this;
  var d = new Date();
  d = new Date(d.getTime() - (-180) * 60000);
  self._currentTab = null;
  self._siteRegexp= /(chrome|file):\/\//;
  self._startTime = null;
  self._tabRemove = false;
  self._idle=false;
  chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // This tab has updated, but it may not be on focus.
      // It is more reliable to request the current tab URL.
      tabToUrl=self.tabToUrl;
      if(tabToUrl[tabId]){
        if(tabToUrl[tabId].url!=tab.url){
          var tmp=tabToUrl[tabId].time+ (new Date()-self._startTime)/1000;
          if(!self._ignoreSite(tabToUrl[tabId].url)){
          self._saveSite(tabToUrl[tabId]);
          console.log(tabToUrl[tabId].url+" changed after "+tmp+" seconds");
          }
          tabToUrl[tabId]={};
          tabToUrl[tabId].url=tab.url;
          tabToUrl[tabId].time=0;
          tabToUrl[tabId].date=d.getTime();
          localStorage.tabToUrl =JSON.stringify(tabToUrl);
        }
      }
      else{
        tabToUrl[tabId]={}
        tabToUrl[tabId].url=tab.url;
        tabToUrl[tabId].time=0;
        tabToUrl[tabId].date=d.getTime();
        localStorage.tabToUrl =JSON.stringify(tabToUrl);
      }

      self._updateTimeWithCurrentTab();
    }
  );
  chrome.tabs.onActivated.addListener(

    function(activeInfo) {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        self._setCurrentFocus(tab.url,tab.id);
      });
    }
  );
  chrome.windows.onFocusChanged.addListener(
    function(windowId) {
      if (windowId == chrome.windows.WINDOW_ID_NONE) {
        self._setCurrentFocus(null);
        return;
      }
      self._updateTimeWithCurrentTab();
    }
  );
  chrome.tabs.onRemoved.addListener(function(tabId, info) {
    self._setTabRemove(true);
    tabToUrl=self.tabToUrl;
    var tmp=tabToUrl[tabId].time;
    if(!self._ignoreSite(tabToUrl[tabId].url)){
      self._saveSite(tabToUrl[tabId]);
      console.log(tabToUrl[tabId].url+" removed after "+tmp+" seconds");
    }
    delete tabToUrl[tabId];
    localStorage.tabToUrl= JSON.stringify(tabToUrl);

  });
  chrome.idle.onStateChanged.addListener(function(idleState) {
    if (idleState == "active") {
      self._idle = false;
      self._updateTimeWithCurrentTab();
    } else {
      self._idle = true;
      self._setCurrentFocus(null);
    }
  });
  chrome.alarms.create(
    "updateTime",
    {periodInMinutes: 3});
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "updateTime") {
      // These event gets fired on a periodic basis and isn't triggered
      // by a user event, like the tabs/windows events. Because of that,
      // we need to ensure the user is not idle or we'll track time for
      // the current tab forever.
      if (!self._idle) {
        self._updateTimeWithCurrentTab();
      }
      // Force a check of the idle state to ensure that we transition
      // back from idle to active as soon as possible.
      chrome.idle.queryState(60, function(idleState) {
        if (idleState == "active") {
          self._idle = false;
        } else {
          self._idle = true;
          self._setCurrentFocus(null);
        }
      });
    }
  });

}

Object.defineProperty(Tracker.prototype, "tabToUrl", {
  get: function() {

    return JSON.parse(localStorage.tabToUrl);
  }
});


Tracker.prototype._updateTimeWithCurrentTab = function() {
  var self=this;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    if (tabs.length == 1) {
      // Is the tab in the currently focused window? If not, assume Chrome
      // is out of focus. Although we ask for the lastFocusedWindow, it's
      // possible for that window to go out of focus quickly. If we don't do
      // this, we risk counting time towards a tab while the user is outside of
      // Chrome altogether.
      var url = tabs[0].url;
      var tabId= tabs[0].id
      chrome.windows.get(tabs[0].windowId, function(win) {
        if (!win.focused) {
          url = null
          tabId = null;
        }
        self._setCurrentFocus(url,tabId);
      });
    }
  });
};

Tracker.prototype._ignoreSite = function(url) {
  if(url){
    var match = url.match(this._siteRegexp);
    if (match || url=='about:blank') {
      return true;
    }
    return false;
  }
  else return false;
};


Tracker.prototype._updateTime = function() {
  var self=this;
  if (!self._currentTab || !self._startTime) {
    return;
  }
  var delta = new Date() - self._startTime;
  tabToUrl = self.tabToUrl;
  //if(!this.getSiteFromUrl(this._currentTab)){
  tabToUrl[self._currentTab].time += delta/1000;
  //}
  localStorage.tabToUrl = JSON.stringify(tabToUrl);
};


Tracker.prototype._setTabRemove = function(flag) {
  this._tabRemove=flag;
};

Tracker.prototype._setCurrentFocus = function(url,tabId) {
  var self=this;
  console.log("setCurrentFocus: " + url);
  if(!self._tabRemove){
    self._updateTime();
  }
  else{
    self._setTabRemove(false);
  }
  if (url == null) {
    self._currentTab = null;
    self._startTime = null;
  } else {
    self._currentTab = tabId ;
    self._startTime = new Date();
  }
};


Tracker.prototype._saveSite= function(site){
  var url="https://floating-depths-67676.herokuapp.com/history/save";
  var data={};
  data.length=1;
  data.historyItems=JSON.stringify([{"lastVisitTime":site.date , "url": site.url , "runningTime" : site.time }]);
  chrome.storage.local.get(["user"], function(fbName){
  data.user=fbName.user;
  console.log(JSON.stringify(data));
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      console.log(xhr.response);
    }
  }
  xhr.send(JSON.stringify(data));
});
}
