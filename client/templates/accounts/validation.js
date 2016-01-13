/**
 * Helpers
 */

$.validator.setDefaults({
  rules: {
    fullname: {
      required: true
    },
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 6
    },
    newPassword: {
      required: true,
      minlength: 6
    },
    confirmNewPassword: {
      required: true,
      minlength: 6
    },
    termsOfServices: {
      required: true 
    }
  },
  messages: {
    fullname: {
      required: i18n('form.fullname_required')
    },
    email: {
      required: i18n('form.email_required'),
      email: i18n('form.email_check')
    },
    password: {
      required: i18n('form.password_required'),
      minlength: i18n('form.password_check')
    },
    newPassword: {
      required: i18n('form.password_required'),
      minlength: i18n('form.password_check')
    },
    confirmNewPassword: {
      required: i18n('form.password_required'),
      minlength: i18n('form.password_check')
    },
    termsOfServices: {
      required: i18n('form.term_of_service_check')
    }
  },
  errorPlacement: function (error, element) {
    if (element.attr("type") == "checkbox") {
      error.insertAfter($(element).parent('label'));
    } else {
      error.insertAfter(element);
    }
  }
});