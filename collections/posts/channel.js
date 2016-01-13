Channels = new Meteor.Collection('channels');

Channels.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: i18n('channel_name')
    },
    colorPicker: {
        type: String,
        optional: true,
        label: i18n('channel_color'),
        autoform: {
            type: "bootstrap-colorpicker"
        }
    }
}));