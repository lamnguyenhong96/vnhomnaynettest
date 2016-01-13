/**
 * Header
 */

Template.header.events({
  'click .header-user-logout': function(event) {
    event.preventDefault();
    Meteor.logout(function(err){
        if (err) {
            throw new Meteor.Error("Logout failed");
        }
    });
  }
});

Template.header.helpers({
  headerAction: function() {
    if (Meteor.user()) {
      Meteor.setTimeout(function () {
        //dropdown
        var dropdown = $('.dropdown');
        if (dropdown.length) {
          var dropdownHeader = dropdown.find('.dropdown-header');
          if (dropdownHeader.length) {
            dropdownHeader.click(function(e) {
              $(this).parent('.dropdown').toggleClass('active');
              e.preventDefault();
            });
          }
        }

        //search
        var headerSearch = $('.header-search');
        if (headerSearch.length) {
          headerSearch.click(function(e) {
            var formSearch = $('.header-search-form');
            if (formSearch.length) {
              formSearch.toggleClass('active');
            }
            e.preventDefault();
          });
        }

        $(document).bind('click', function(e) {
          if($(e.target).closest('.dropdown').length == 0) {
            if (dropdown.hasClass('active')) {
              dropdown.removeClass('active');
            }
          }
          if($(e.target).closest('.header-search-form').length == 0 && $(e.target).closest('.header-search').length == 0){
            var headerSearchForm = $('.header-search-form');
            if (headerSearchForm.hasClass('active')) {
              headerSearchForm.removeClass('active');
            }
          }
        });

        //toggle
        var toggle = $('.toggle');
        if (toggle.length) {
          toggle.click(function(e) {
            var container = $('.container-wrapper');
            container.toggleClass('push-to-right');
            e.preventDefault();
          });
        }
      }, 100);
    }
  },
  checkUrl: function () {
    if (Router.current().route._path === '/') {
      return 'home';
    }
  }
});
