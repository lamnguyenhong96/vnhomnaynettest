/**
 * Fixture
 */

WebApp.connectHandlers.use("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// add user
if (Meteor.users.find().count() === 0) {
    var adminId = Accounts.createUser({
        profile: {
            name: 'Admin'
        },
        username: "admin",
        email: "admin@vnhomnay.net",
        password: "vnhomnay$1"
    });
}

S3.config = {
    key: "AKIAIY7REEKSXNK2MK6Q",
    secret: "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",
    bucket: "s3crop",
    region: "ap-southeast-1"
};

if (Channels.find().count() === 0) {
    var channels = [{name: "Xã hội", colorPicker: "#553C8E"}, {
        name: "Giải Trí",
        colorPicker: "#07A957"
    }, {name: "Thể thao", colorPicker: "#FF6704"}, {name: "Công nghệ", colorPicker: "#0473BA"}, {
        name: "Pháp luật",
        colorPicker: "#344E70"
    }, {name: "Quân sự", colorPicker: "#636F76"}, {name: "Kinh doanh", colorPicker: "#00ACED"}, {
        name: "Giáo dục",
        colorPicker: "#085F2D"
    }, {name: "Quốc tế", colorPicker: "#C90826"}];
    _.each(channels, function (channel) {
        Channels.insert(channel);
    });
}

if (Tags.find().count() === 0) {
    var tags = [{name: "Xã hội"}, {name: "Giải Trí"}, {name: "Thể thao"}, {name: "Công nghệ"}, {name: "Pháp luật"},{name: "Quân sự"}, {name: "Kinh doanh"}, {name: "Giáo dục"}, {name: "Quốc tế"}];
    _.each(tags, function (tag) {
        Tags.insert(tag);
    });
}