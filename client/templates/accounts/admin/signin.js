Template.signinAdmin.events({
    'submit form': function(event) {
        event.preventDefault();

        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
            if(error){
                Session.set('error', 'Your email or password is incorrect!');

            } else {
                Session.set('error', '');
                Router.go("/admin");
            }
        });
    }
});

Template.signinAdmin.helpers({
    error: function() {
        return Session.get('error');
    }
});

