Meteor.users.allow({
    update: function (userId) {
        return true;
    },
    insert: function (userId) {
        return true;
    }
});

function trueFunc(userId){
    var stm = true;
    if(!userId)
         stm = false;
    return stm;
}

function falseFunc(){
    return false;
}

Posts.allow({
    insert: trueFunc,
    update: trueFunc,
    remove: trueFunc
});
Posts.deny({
    insert: falseFunc,
    update: falseFunc,
    remove: falseFunc
})