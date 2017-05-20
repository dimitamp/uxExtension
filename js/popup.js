//get document in order to access eleemnts
document.addEventListener('DOMContentLoaded', function() {
  //fetch btn to catch click event
  var fetchBtn = document.getElementById('fetchBtn');
  fetchBtn.addEventListener('click', function() {
    document.getElementById('loadingHistory').style.visibility="visible";
    chrome.storage.local.get(["user"], function(fbName){
      if(fbName){
        //history search request text:leave empty to get all , maxResults: number ( default 100)
        lastHistoryUpdate(fbName,function(lastUpdateTime){
          chrome.history.search({'text': '','maxResults':20000,'startTime':lastUpdateTime},function(results){
          historyItems=resEdit(results);
          saveHistory(JSON.stringify(historyItems),fbName,Object.keys(historyItems).length);
          });
        });

      }
    });

  }, false);


  var profileBtn = document.getElementById('profileBtn');
  profileBtn.addEventListener('click', function() {
    document.getElementById('loadingProfile').style.visibility="visible";
    chrome.storage.local.get(["user"], function(fbName){
      if(fbName){
        //alert(document.getElementById('profileType').style.content);
        createProfile(fbName,"general");
      }
    });
  }, false);

},false);


var createProfile= function(fbName,type){
  var url="https://floating-depths-67676.herokuapp.com/profile"
  var data={};
  data.profileType=type;
  data.user=fbName.user;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      document.getElementById('loadingProfile').style.visibility="hidden";
      alert(xhr.response);
    }
  }
  xhr.send(JSON.stringify(data));
}




var resEdit = function (searchResults){
  var editedResults=[];
  var index,len=Object.keys(searchResults).length;
  for (index = 0; index < len; ++index) {
    var historyItem={};
    var url=searchResults[index].url;
    if( url.substr(0,3)=="file"){
      continue;
    }else {
      historyItem.lastVisitTime=searchResults[index].lastVisitTime;
      historyItem.url=url;
      //historyItem.visitCount=searchResults[index].visitCount;
      editedResults.push(historyItem);
    }
  }
  return editedResults;
}

var saveHistory= function(historyItems,fbName,len){
  var url="https://floating-depths-67676.herokuapp.com/history/save";
  var data={};
  data.length=len;
  data.user=fbName.user;
  data.historyItems=historyItems;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        document.getElementById('loadingHistory').style.visibility="hidden";
      alert(xhr.response);
    }
  }
  xhr.send(JSON.stringify(data));
}


var lastHistoryUpdate = function (fbName,callback){
  var url="https://floating-depths-67676.herokuapp.com/history/lastupdate";
  var xhr = new XMLHttpRequest();
  var data={};
  data.user=fbName.user;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.response);
      var lastUpdateTime=response.lastVisitTime;
      callback(lastUpdateTime);
    }
  }
  xhr.send(JSON.stringify(data));
}
