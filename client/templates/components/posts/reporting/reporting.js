/**
 * Reporting
 */

Template.reporting.onRendered(function() {
  // url
  var link = $('.link');
  if (link.length) {
    link.click(function(e) {
      var url = $(this).parents('.form-custom-column').siblings('.form-custom-url');
      url.addClass('active');
      e.preventDefault();
    });
  }

  // close
  var close = $('.form-custom-url').find('.button');
  if (close.length) {
    close.click(function(e) {
      $(this).parent().removeClass('active');
      e.preventDefault();
    })
  }

  // select 2
  var select2 = $('.select-tag');
  if (select2.length) {
    select2.select2({
      tags: true,
      placeholder: "#tags"
    });
  }

  // select custom
  var selectCustom = $('.select-custom');
  if (selectCustom.length) {
    selectCustom.each(function() {
      var selectCustomHeader = $(this).find('.select-custom-header');
      selectCustomHeader.click(function(e) {
        $(this).parents('.select-custom').toggleClass('active');
        e.preventDefault();
      });

      var item = $(this).find('.select-custom-body a');
      item.click(function(e) {
        var select = $(this).parents('.select-custom'),
            selectHeader = select.find('.select-custom-header').find('span'),
            selectOption = select.find('select'),
            str = $(this).html();
        selectHeader.html(str);
        item.removeClass('active');
        $(this).addClass('active');
        select.removeClass('active');
        selectOption.find('option').removeAttr('selected');
        selectOption.find('option[value="' + str + '"]').attr('selected', 'selected');
        e.preventDefault();
      });
    });
  }
  
  $(document).bind('click', function(e) {
    if($(e.target).closest('.select-custom').length == 0) {
      if (selectCustom.hasClass('active')) {
        selectCustom.removeClass('active');
      }
    } else {
      selectCustom.not($(e.target).closest('.select-custom')).removeClass('active');
    }
  });
});