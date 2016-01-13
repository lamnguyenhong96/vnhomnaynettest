/**
 * Dashboard
 */

Template.dashboard.onRendered(function(){

  // set height sidebar
  setHeight();

  $(window).resize(function() {
    setHeight();
  });

  function setHeight() {
    var sidebar = $('.main-sidebar');
    if (sidebar.length) {
      var hContent = $('.main-content').height(),
          hSidebar = sidebar.height();
      if (hContent > hSidebar) {
        sidebar.parent('.bg-gray').height(hContent + 30);
      }
    }
  }

});