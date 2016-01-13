/**
 * Login
 */

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
    },
    'click .form-label-custom': function (event) {
      event.preventDefault();
      var label = $(event.currentTarget), input = $(label.find('input'));
      if (label.hasClass('checked')) {
        label.removeClass('checked');
        input.removeAttr('checked');
      } else {
        label.addClass('checked');
        input.attr('checked', 'checked');
      }
    },
    'click .social-button.facebook': function(event) {
      event.preventDefault();
      Meteor.loginWithFacebook({requestPermissions: ['email']}, function(err){
          if(!err) {
              Router.go("/");
          } else {
              throw new Meteor.Error("Facebook login failed");
          }
      });
    },
    'click .social-button.twitter': function(event) {
      event.preventDefault();
      Meteor.loginWithTwitter(function(err){
          if(!err) {
              Router.go("/");
          } else {
              throw new Meteor.Error("Twitter login failed");
          }
      });
    },
    'click .social-button.google': function(event) {
      event.preventDefault();
      Meteor.loginWithGoogle(function(err){
          if(!err) {
              Router.go("/");
          } else {
              throw new Meteor.Error("Google login failed");
          }
      });
    },
    'click .social-button.linkedin': function(event) {
      event.preventDefault();
      Meteor.loginWithLinkedin(function(err){
          if(!err) {
              Router.go("/");
          } else {
              throw new Meteor.Error("Linkedin login failed");
          }
      });
    }
});

Template.login.onRendered(function(){
    var validator = $('.login-form').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();

            Meteor.loginWithPassword(email, password, function(err){
                if (!err) {
                    Router.go('/');
                } else {
                    if(err.reason == "User not found"){
                        validator.showErrors({
                            email: i18n('form.email_not_found')
                        });
                    }
                    if(err.reason == "Incorrect password"){
                        validator.showErrors({
                            password: i18n('form.password_error')
                        });
                    }
                }
            });
        }
    });
});