// Do not forget to add the email package: $ meteor add email
// and to configure the SMTP: https://gist.github.com/LeCoupa/9879221

Template.ForgotPassword.events({
  'submit #forgotPasswordForm': function(e, t) {
    e.preventDefault();

    var forgotPasswordForm = $(e.currentTarget),
        email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

    if (email) {

      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            console.log('This email does not exist.');
          } else {
            console.log('We are sorry but something went wrong.');
          }
        } else {
          console.log('Email Sent. Check your mailbox.');
        }
      });

    }
    return false;
  },
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();
    
    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();

    if (password && (password === passwordConfirm)) {
      Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
        if (err) {
          console.log('We are sorry but something went wrong.');
        } else {
          console.log('Your password has been changed. Welcome back!');
          Session.set('resetPassword', null);
        }
      });
    }
    return false;
  }
});

if (Accounts._resetPasswordToken) {
  Session.set('resetPassword', Accounts._resetPasswordToken);
}

Template.ForgotPassword.helpers({
 resetPassword: function(){
  return Session.get('resetPassword');
 }
});

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}