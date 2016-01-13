Template.resetPassword.events({
  'submit form': function(event) {
    event.preventDefault();
  }
});

Template.resetPassword.onRendered(function(){
    var validator = $('.reset-form').validate({
        submitHandler: function(event){

            var currentPassword =  $('[id=currentPassword]').val(),
                newPassword = $('[id=newPassword]').val(),
                confirmNewPassword = $('[id=confirmNewPassword]').val();

            if (newPassword !== confirmNewPassword) {
                validator.showErrors({
                    confirmNewPassword: i18n('form.dont_match_password')
                });
            } else {
                Accounts.changePassword(currentPassword, newPassword, function(err){
                    if (!err) {
                        Router.go('/');
                    } else {
                        if(err.message == "Incorrect password [403]"){
                            validator.showErrors({
                                password: i18n('form.incorrect_password')
                            });
                        }
                    }
                });
            }
        }
    });
});
