/*
 * Method
 */

Meteor.methods({
    postInsert: function (obj) {
        return Posts.insert(obj,{validate: false});
    },
    upsertTags: function(currentTags){
        var tags =_.map(Tags.find().fetch(), function(tag){return tag.name});
        _.each(currentTags, function(tag){
            if(!_.contains(tags,tag)){
                Tags.insert({name: tag});
            }
        })
    }
});