/**
 * Offcanvas
 */

Template.offcanvas.onRendered(function(){
  //close
  var close = $('.offcanvas-close');
  if (close.length) {
    close.click(function(e) {
      var container = $('.container-wrapper');
      container.removeClass('push-to-right');
      e.preventDefault();
    });
  }

  //dropdown
  var offcanvasUser = $('.offcanvas-user');
  if (offcanvasUser.length) {
    var offcanvasUserHeader = offcanvasUser.find('.offcanvas-user-header');
    if (offcanvasUserHeader.length) {
      offcanvasUserHeader.click(function(e) {
        $(this).parent('.offcanvas-user').toggleClass('active');
        e.preventDefault();
      });
    }
  }
});

Template.offcanvas.events({
  'click .offcanvas-logout-button': function(event) {
    event.preventDefault();
    Meteor.logout(function(err){
        if (err) {
            throw new Meteor.Error("Logout failed");
        }
    });
  }
});