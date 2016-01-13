/**
 * Highlight
 */

Template.highlight.onRendered(function() {
  $('#highlight').slick({
    arrows: true,
    slidesToShow: 1,
    infinite: true,
    speed: 500,
    centerMode: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          centerMode: false,
          variableWidth: false
        }
      },
    ]
  });
});