Tags = new Meteor.Collection("tags");

Tags.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: i18n("tag_name")
    }
}));