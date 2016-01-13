Meteor.subscribe('users');

Template.profileDetails.helpers({
    name: function () {return Meteor.user().profile.name}
});

Template.profileDetails.events({
    'submit form': function (event) {
        event.preventDefault();
    }
});

Template.profileDetails.onRendered(function(){
    var validator = $('.setting-profile').validate({
        submitHandler: function(event){
            var pictureUrl = $('[name=pictureUrl]').val(),
                fullname = $('[name=fullname]').val(),
                aboutyou = $('[name=aboutyou]').val(),
                company  = $('[name=company]').val(),
                address  = $('[name=address]').val(),
                phone    = $('[name=phone]').val(),
                website  = $('[name=website]').val(),
                skype    = $('[name=skype]').val();
            var message;
            if(Meteor.userId())
            {
                Meteor.users.update(Meteor.userId(),{$set: {profile: {pictureUrl: pictureUrl, name: fullname, aboutyou: aboutyou, company: company, address: address, phone: phone, website: website,skype: skype }}});
            }
            if (event) {
                validator.showErrors({
                    submit: i18n('form.update_success')
                });
            }
            else {
                validator.showErrors({
                    submit: i18n('form.update_error')
                });
            }
        }

    });
});
