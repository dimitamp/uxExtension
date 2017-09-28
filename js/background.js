var successURL = 'https://floating-depths-67676.herokuapp.com/fb';

function onFacebookLogin(){

  chrome.storage.local.get(/* String or Array */["accessToken"], function(accTok){
    if (accTok) {
      chrome.tabs.query({}, function(tabs) { // get all tabs from every window
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].url.indexOf(successURL) !== -1) {
            // below you get string like this: access_token=...&expires_in=...
            var params = tabs[i].url.split('#')[1];

            // in my extension I have used mootools method: parseQueryString. The following code is just an example ;)
            var accessToken = params.split('&')[0];
            accessToken = accessToken.split('=')[1];
            localStorage.accessToken = accessToken;
            //chrome.storage.local.set({ "accessToken": accessToken }, function(){  });


            getFbInfo();
            chrome.tabs.remove(tabs[i].id);
          }
        }
      });
    }
  });
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);

chrome.alarms.create(
  "updateProfile",
  {periodInMinutes: 1440});
chrome.alarms.create(
  "updateNews",
  {periodInMinutes: 180});
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "updateNews") {
      update("updateReadNews");
    }
    if( alarm.name== "updateProfile"){
      update("profile/update");
    }
  });



  var getFbInfo=function(){
    //chrome.storage.local.get(["accessToken"], function(accTok){
      //if (accTok.accessToken) {
      if(localStorage.accessToken){
        var url="https://graph.facebook.com/v2.6/me?fields=first_name,last_name&access_token="+localStorage.accessToken;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            var data=JSON.parse(xhr.response);
            var user=data.first_name+data.last_name;
            //chrome.storage.local.set({ "user": user }, function(){});
            localStorage.user = user;
          }
        }
        xhr.send(null);
      }
    //});
  }

  var update = function (item){
    //chrome.storage.local.get(["user"], function(fbName){
      var user = localStorage.user;
      if(user){
        var url="https://floating-depths-67676.herokuapp.com/"+item;
        var xhr = new XMLHttpRequest();
        var data={};
        data.user=user;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);
          }
        }
        xhr.send(JSON.stringify(data));
      }
    //});
  }
  //check whether user has saved history for the first time and then start saving single websites
//chrome.storage.local.get(["historySaved"], function(flag){
  //if(flag){

  var tracker = new Tracker();

//});
