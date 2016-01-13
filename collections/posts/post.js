Posts = new Meteor.Collection("posts");

Posts.list = function(options) {
    options = _.extend({ sort: { name: 1 }}, options);
    return Posts.find({}, options);
};