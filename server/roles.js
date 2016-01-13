/**
 * Role
 */

var admin = Meteor.users.findOne({username: "admin"});
Roles.addUsersToRoles(admin, ["admin"]);