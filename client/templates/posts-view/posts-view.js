/**
 * Created by nam on 07/01/2016.
 */

Template.postsView.helpers({
    postsListCursor: function() {
        return Posts.list;
    },
    options: function() {
        return [
            {type: 'newest', name: "Sort Newest to Oldest"},
            {type: 'oldest', name: "Sort Oldest to Newest"}
        ];
    }
});

Template.postsView.events({
   'click #sortType':  function(event) {
       //console.log($(event.target).find(':selected'));
       var num = 1, option = $("#sortType").find(':selected')[0].value;

       if(option == 'oldest') {
           num = -1;
       }
       ServerSession.set('postQuery', {createdAt: num});
   }

});