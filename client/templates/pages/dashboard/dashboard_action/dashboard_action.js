/**
 * Dashboard Action
 */

Template.dashboardAction.onRendered(function() {
  var action = $('.action-list a');
  if (action.length) {
    action.click( function(e) {
      tab = $(this).data('opentab');
      $('.nav-tabs li:eq(' + tab + ') a').tab('show');
      e.preventDefault();
    });
  }
});