/**
 * Account
 */

Accounts.onCreateUser(function (options, user) {
    user.profile = {};
    if (typeof(user.services.linkedin) !== "undefined") {
        var linkedinService = user.services.linkedin;
        options.profile.name = linkedinService.firstName + ' ' + linkedinService.lastName;
    }
    if (typeof(user.services.facebook) !== "undefined") {
        var facebookService = user.services.facebook;
        options.profile.pictureUrl = "http://graph.facebook.com/" + facebookService.id + "/picture/?type=large";
    }
    if (typeof(user.services.twitter) !== "undefined") {
        var twitterService = user.services.twitter;
        options.profile.pictureUrl = twitterService.profile_image_url;
    }
    if (typeof(user.services.google) !== "undefined") {
        var googleService = user.services.google;
        options.profile.pictureUrl = googleService.picture;
    }    
    user.profile = options.profile;
    return user;
});