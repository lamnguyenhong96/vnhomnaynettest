/*
 * Main
 */

Template.registerHelper('getChannels',function(){
   return Channels.find();
});