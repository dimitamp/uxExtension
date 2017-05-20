function Sites() {
  if (!localStorage.sites) {
    localStorage.sites = JSON.stringify({});
  }
  this._currentSite = null;
  this._siteRegexp= /(chrome|file):\/\//;
  this._startTime = null;
  this._tabRemove = false;
}

Object.defineProperty(Sites.prototype, "sites", {
  get: function() {
    var s = JSON.parse(localStorage.sites);
    var sites = {}
    for (var site in s) {
      if (s.hasOwnProperty(site)) {
        sites[site] = s[site];
      }
    }
    return sites;
  }
});


Sites.prototype.getSiteFromUrl = function(url) {
  if(url){
    var match = url.match(this._siteRegexp);
    if (match) {
      return true;
    }
    return false;
  }
  else return false;
};

Sites.prototype.updateSites = function(oldSite,newSite) {
  var sites=this.sites;
  if(oldSite){
    delete sites[oldSite];
  }
  if(newSite){
    sites[newSite]=0;
  }
  localStorage.sites=JSON.stringify(sites);
};

Sites.prototype._updateTime = function() {
  if (!this._currentSite || !this._startTime) {
    return;
  }
  var delta = new Date() - this._startTime;
  var sites = this.sites;
  //if(!this.getSiteFromUrl(this._currentSite)){
  sites[this._currentSite] += delta/1000;
  //}
  localStorage.sites = JSON.stringify(sites);
};

Sites.prototype.setTabRemove = function(flag) {
  this._tabRemove=flag;
};

Sites.prototype.setCurrentFocus = function(url) {
  console.log("setCurrentFocus: " + url);
  if(!this._tabRemove){
  //this._updateTime();
  }
  else{
    this.setTabRemove(false);
  }
  if (url == null) {
    this._currentSite = null;
    this._startTime = null;
  } else {
    this._currentSite = url ;
    this._startTime = new Date();
  }
};
