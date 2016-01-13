/**
 * Router
 */

var subs = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 10,
    // any subscription will be expire after 5 minute, if it's not subscribed again
    expireIn: 5
});

Router.configure({
    layoutTemplate: "layout"
});

Router.route('/', {
    template: 'home',
    waitOn: function () {
        return [
            subs.subscribe("posts"),
            subs.subscribe("channels")
        ]
    },
    fastRender: true
});

Router.route('/login', {
    template: 'login'
});

Router.route('/register', {
    template: 'register'
});

Router.route('/forgot-pasword', {
    template: 'ForgotPassword'
});

Router.route('/reset-password', {
    template: 'resetPassword'
});

Router.route('/dashboard', {
    template: 'dashboard',
    waitOn: function () {
        return subs.subscribe("channels");
    },
    onBeforeAction: function (pause) {
        if (!Meteor.userId()) {
            this.render('login');
        } else {
            this.next();
        }
    }
});

Router.route("/settings", {
    template: "settings",
    yieldTemplates: {
        'profileDetails': {to: 'detailrender'}
    },
    onBeforeAction: function (pause) {
        if (!Meteor.userId()) {
            this.render('login');
        } else {
            this.next();
        }
    }
});

Router.route("/settings/change-password", {
    template: "settings",
    yieldTemplates: {
        'changePassword': {to: 'detailrender'}
    }
});
Router.route('/post-insert', {
    template: "postModalex",
    name: 'postInsert',
    waitOn: function () {
        return subs.subscribe("posts");
    }
});

Router.route('/posts-view', {
    template: "postsView",
    name: 'postsView'
});

//User profile
Router.route ("/my-profile", {
    template: "userProfile",
    onBeforeAction: function (pause) {
        if (! Meteor.userId()) {
            this.render('login');
        } else {
            this.next();
        }
    }
});
