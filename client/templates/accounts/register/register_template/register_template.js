/**
 * Register Template
 */

Template.registerTemplate.events({
    'submit .register-form': function (event) {
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

Template.registerTemplate.onRendered(function(){
  var registerForm = $('.register-form');
  if (registerForm.length) {
    registerForm.each(function() {
      var validator = $(this).validate({
        submitHandler: function(event){
          var email = $('[name=email]').val();
          var password = $('[name=password]').val();
          var fullname = $('[name=fullname]').val();

          var user = {'email': email, password: password, profile: {name: fullname}};

          Accounts.createUser(user, function(err){
              if (!err) {
                Router.go('/');
              } else {
                if(err.reason == "Email already exists."){
                  validator.showErrors({
                    email: i18n('form.email_exist')
                  });
                }
              }
          });
        }
      });
    });
  }
});
