$(function() {
  $('.project').each(function() {
    var $projectBar = $(this).find('.bar');
    var $projectPercent = $(this).find('.percent');
    $projectBar.slider({
      range: "min",
      animate: true,
      value: 100,
      min: 1,
      max: 100,
      step: 1,
      slide: function(event, ui) {
        $projectPercent.html(ui.value + "%");
      },

    });
  })
})
