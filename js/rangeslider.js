$(function() {
  $('.project').each(function() {
    var $projectBar = $(this).find('.bar');
    var $projectPercent = $(this).find('.percent');
    $projectBar.slider({
      range: "min",
      animate: true,
      value: 1,
      min: 1,
      max: 13,
      step: 1,
      slide: function(event, ui) {
        if(ui.value==1){
          $projectPercent.html(ui.value+" month of browsing history");
        }
        else if (ui.value==13){
          $projectPercent.html("All browsing history");
        }
        else{
        $projectPercent.html(ui.value+" month/s of browsing history");
      }
      },

    });
  })
})
