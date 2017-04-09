//get document in order to access eleemnts
document.addEventListener('DOMContentLoaded', function() {
  //fetch btn to catch click event
  var fetchBtn = document.getElementById('fetchBtn');
  fetchBtn.addEventListener('click', function() {
    chrome.storage.local.get(["name"], function(fbName){
      if(fbName){
        //history search request text:leave empty to get all , maxResults: number ( default 100)
          chrome.history.search({'text': '','maxResults':1,'startTime':0},function(results){
          saveHistory(JSON.stringify(results),fbName);
        });
      }
    });
  }, false);

},false);



var saveHistory= function(history,fbName){
  var url="https://floating-depths-67676.herokuapp.com/history";
  var data={};
  data.name=fbName.name;
  data.historyItems=history;
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
