Template.settings.helpers({
    activeSettings: function(name){
        var currentUrl = Router.current().route.path(this);
        if(name == currentUrl){
            return "active";
        }
    }
});