Template.home.events({
  'click .btn-logout': function(event) {
    event.preventDefault();
    Meteor.logout(function(err){
        if (err) {
            throw new Meteor.Error("Logout failed");
        }
    });
  }
});