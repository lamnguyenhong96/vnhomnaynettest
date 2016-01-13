/**
 * Footer
 */

Template.footer.onRendered(function() {
  var backToTop = $('.back-to-top');
  if (backToTop.length) {
    backToTop.click(function(e){
      $('html, body').animate({scrollTop : 0}, 800);
      e.preventDefault();
    });
  }
});