//get document in order to access eleemnts
document.addEventListener('DOMContentLoaded', function() {
  //fetch btn to catch click event
  var fetchBtn = document.getElementById('fetchBtn');
  fetchBtn.addEventListener('click', function() {
    chrome.storage.local.get(["user"], function(fbName){
      if(fbName){
        //history search request text:leave empty to get all , maxResults: number ( default 100)
          chrome.history.search({'text': '','maxResults':10000,'startTime':0},function(results){
          historyItems=resEdit(results);
          saveHistory(JSON.stringify(historyItems),fbName,Object.keys(historyItems).length);
        });
      }
    });
  }, false);

},false);


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
    historyItem.visitCount=searchResults[index].visitCount;
    editedResults.push(historyItem);
  }
}
  return editedResults;
}

var saveHistory= function(historyItems,fbName,len){
  var url="https://floating-depths-67676.herokuapp.com/history"
  var data={};
  data.length=len;
  data.user=fbName.user;
  data.historyItems=historyItems;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      alert(xhr.response);
    }
  }
  xhr.send(JSON.stringify(data));
}
