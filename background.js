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

            chrome.storage.local.set({ "accessToken": accessToken }, function(){

            });


            getFbInfo();
            chrome.tabs.remove(tabs[i].id);
          }
        }
      });
    }
  });
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);

var getFbInfo=function(){
  chrome.storage.local.get(["accessToken"], function(accTok){
    if (accTok.accessToken) {
      var url="https://graph.facebook.com/v2.6/me?access_token="+accTok.accessToken;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Content-type","application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          var name=JSON.parse(xhr.response).name;
          chrome.storage.local.set({ "name": name }, function(){
          });
          }
        }
        xhr.send(null);
      }
    });
  }
