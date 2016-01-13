/*
 * Publication
 */
Meteor.publish("posts", function () {
    return Posts.find();
});
Meteor.publish("channels", function(){
    return Channels.find();
});