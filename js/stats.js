document.addEventListener('DOMContentLoaded', function()
{
  var timeChartButton = document.getElementById("timeChartButton");
  timeChartButton.addEventListener('click', function() {
    //chrome.storage.local.get(["user"], function(fbName){
    if(localStorage.user){
      resetCanvas();
      getChartData(localStorage.user,function(chartData){
        var backgroundColors = [];
        var index;
        for (index = 0 ;index < 6 ; index++){
          backgroundColors[index] =randomColorGenerator();
        }
        var timeChart = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(timeChart, {
          type: 'pie',
          data: {

            labels: chartData.labels,
            datasets: [{
              data: chartData.values,
              backgroundColor : backgroundColors

            }]
          },
          options :{
            //legend : { display : false },
            title: {
              display: true,
              text: 'Reading Hours',
              fontSize : 16,
            }
          }
        });
      });
    }
    //});
  }, false);

  var topSitesButton = document.getElementById("topSitesButton");
  topSitesButton.addEventListener('click', function() {
    //chrome.storage.local.get(["user"], function(fbName){
    if(localStorage.user){
      resetCanvas();
      getTopSites(localStorage.user,function(chartData){
        var backgroundColors = [];
        var sites=chartData.labels;
        var values=chartData.values;
        var index;
        for (index = 0 ;index < 10 ; index++){
          backgroundColors[index] =randomColorGenerator();
        }
        var topSitesChart = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(topSitesChart, {
          type: 'bar',
          data: {
            labels: ["1","2","3","4","5","6","7","8","9","10"],
            datasets: [{
              label : "Top Sites",
              data: values,
              backgroundColor : backgroundColors

            }
          ]
        },
        options: {
          tooltips: {
            enabled: true,
            callbacks: {
              label: function(tooltipItem, chartData) {
                return sites[tooltipItem.index]+" : "+values[tooltipItem.index]+" times";
              }
            }
          },
          scales: {
            yAxes: [
              {
                scaleLabel:{
                  display: true,
                  labelString: 'Visit Count',
                  //fontColor: "#FFFFFF",
                }
              }
            ],
            xAxes: [
              {
                scaleLabel:{
                  display: true,
                  labelString: 'Sites',
                  //fontColor: "#FFFFFF",
                }
              }
            ]

          },
          legend: { display: false },
          title: {
            display: true,
            text: 'Top 10 Visited Sites',
            fontSize : 16,
          }
        }

      });
    });
  }
  //});
}, false);

var topicsChartButton = document.getElementById("topicsChartButton");
topicsChartButton.addEventListener('click', function() {
  //chrome.storage.local.get(["user"], function(fbName){
  if(localStorage.user){
    resetCanvas();
    getTopicsData(localStorage.user,function(chartData){
      var length = Object.keys(chartData.values).length;
      var backgroundColors = [];
      var index;
      for (index = 0 ;index < length ; index++){
        backgroundColors[index] =randomColorGenerator();
      }
      var topicsChart = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(topicsChart, {
        type: 'pie',
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.values,
            backgroundColor : backgroundColors

          }]
        },
        options :{
          //legend : { display : false },
          title: {
            display: true,
            text: 'Topic Scores Distribution',
            fontSize : 16,
          }
        }
      });
    });
  }
  //});
}, false);


}, false);

var randomColorGenerator = function () {
  return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
};


var getChartData = function (user,callback){
  var url="https://floating-depths-67676.herokuapp.com/charts/sessionsData";
  var xhr = new XMLHttpRequest();
  var data={};
  data.user=user;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.response);
      callback(response);
    }
  }
  xhr.send(JSON.stringify(data));
}

var getTopicsData = function (user,callback){
  var url="https://floating-depths-67676.herokuapp.com/charts/topicsData";
  var xhr = new XMLHttpRequest();
  var data={};
  data.user=user;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.response);
      callback(response);
    }
  }
  xhr.send(JSON.stringify(data));
}

var getTopSites = function (user,callback){
  var url="https://floating-depths-67676.herokuapp.com/charts/topSites";
  var xhr = new XMLHttpRequest();
  var data={};
  data.user=user;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.response);
      callback(response);
    }
  }
  xhr.send(JSON.stringify(data));
}

var resetCanvas = function(){
  var element = document.getElementById('myChart');
  document.getElementById('canvasContainer').removeChild(element);
  element=document.createElement("canvas");
  element.setAttribute("id", "myChart");
  element.setAttribute("width","400");
  element.setAttribute("height","400");
  document.getElementById('canvasContainer').appendChild(element);
}
