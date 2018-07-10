$( document ).ready(() => {
  /**
   * *****************************************************************
   * Registration Form Validation
   * *****************************************************************
   */
  const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const NAME_REGEX = /^([a-zA-Z ]){3,50}$/;
  const PASSWORD_REGEX = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[\W]).{6,18}$/;
  const USERNAME_REGEX = /^[a-z0-9]+$/i;

  // NAME VALIDATOR
  $.validator.addMethod("isName", function (value, element) {
    return this.optional( element ) || NAME_REGEX.test( value );
  }, 'Name should only contain alphabets and white spaces.');

  // USERNAME VALIDATOR
  $.validator.addMethod( "onlyAlphaNumeric", function( value, element ) {
    return this.optional( element ) || USERNAME_REGEX.test( value );
  }, "Username should contain only letters and numbers" );

  // EMAIL VALIDATOR
  $.validator.addMethod("isEmail", function (value, element) {
    return this.optional( element ) || EMAIL_REGEX.test( value );
  }, 'Invalid Email.');

  // PASSWORD VALIDATOR
  $.validator.addMethod("isPassword", function (value, element) {
    return this.optional( element ) || PASSWORD_REGEX.test( value );
  }, 'Password should have at least one lower case, one UPPER CASE, one number, one special character.');

  $( "#registerForm" ).validate( {
    rules: {
      name: {
        required: true,
        minlength: 3,
        maxlength: 50,
        isName: true
      },
      username: {
        required: true,
        minlength: 3,
        maxlength: 20,
        onlyAlphaNumeric: true,
        remote: '/user/scripts/usernameExists'
      },
      email: {
        required: true,
        isEmail: true,
        remote: '/user/scripts/emailExists'
      },
      password: {
        required: true,
        minlength: 5,
        isPassword: true
      },
      password2: {
        required: true,
        equalTo: "#password"
      },
      agree: "required"
    },
    messages: {
      name: {
        required: "Please enter your name",
        minlength: "Your name must consist of at least 3 characters",
        maxlength: "Your name must not contain more than 50 characters",
      },
      username: {
        required: "Please enter a username",
        minlength: "Your username must consist of at least 3 characters",
        maxlength: "Your username must not contain more than 20 characters",
        remote: $.validator.format("\'{0}\' is already taken. Please try another.")
      },
      email: {
        required: "Please enter your email",
        isEmail: "Please enter a valid email address",
        remote: $.validator.format("\'{0}\' is already associated with an account.")
      },
      password: {
        required: "Please enter a password",
        minlength: "Your password must be at least 5 characters long"
      },
      password2: {
        required: "Please confirm your password",
        equalTo: "Please enter the same password as above"
      },
      agree: "Please accept our policy"
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Login Form Validation
   * *****************************************************************
   */
  $( "#loginForm" ).validate({
    rules: {
      username: {
        required: true,
      },
      password: {
        required: true
      }
    },
    messages: {
      username: {
        required: "Please enter your username",
      },
      password: {
        required: "Please enter your password",
      },
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Login Form Validation
   * *****************************************************************
   */
  $( "#forgotPasswordForm" ).validate({
    rules: {
      email: {
        required: true,
        isEmail: true
      }
    },
    messages: {
      email: {
        required: "Please enter your email"
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Reset Password Form Validation - without logging in
   * *****************************************************************
   */
  $( "#resetPasswordForm" ).validate( {
    rules: {
      password: {
        required: true,
        minlength: 5,
        isPassword: true
      },
      password2: {
        required: true,
        equalTo: "#password"
      }
    },
    messages: {
      password: {
        required: "Please enter a password",
        minlength: "Your password must be at least 5 characters long"
      },
      password2: {
        required: "Please confirm your password",
        equalTo: "Please enter the same password as above"
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Reset Password Form Validation - with logging in
   * *****************************************************************
   */
  $( "#changePasswordForm" ).validate( {
    rules: {
      old_password: {
        required: true,
      },
      new_password: {
        required: true,
        minlength: 5,
        isPassword: true
      },
      password2: {
        required: true,
        equalTo: "#new_password"
      }
    },
    messages: {
      old_password: {
        required: "Please enter your old password"
      },
      new_password: {
        required: "Please enter a new password",
        minlength: "Your password must be at least 5 characters long"
      },
      password2: {
        required: "Please confirm your new password",
        equalTo: "Please enter the same password as above"
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Reset Password Form Validation
   * *****************************************************************
   */
  $("#changeUsernameForm").validate({
    rules: {
      username: {
        required: true,
        minlength: 3,
        maxlength: 20,
        onlyAlphaNumeric: true,
        remote: '/user/scripts/usernameExists'
      }
    },
    messages: {
      username: {
        required: "Please enter a username",
        minlength: "Your username must consist of at least 3 characters",
        maxlength: "Your username must not contain more than 20 characters",
        remote: $.validator.format("\'{0}\' is already taken. Please try another.")
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Reset Email Form Validation
   * *****************************************************************
   */
  $("#changeEmailForm").validate({
    rules: {
      email: {
        required: true,
        isEmail: true,
        remote: '/user/scripts/emailExists'
      }
    },
    messages: {
      email: {
        required: "Please enter your email",
        isEmail: "Please enter a valid email address",
        remote: $.validator.format("\'{0}\' is already associated with an account.")
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  /**
   * *****************************************************************
   * Reset Name Form Validation
   * *****************************************************************
   */
  $( "#changeNameForm" ).validate( {
    rules: {
      name: {
        required: true,
        minlength: 3,
        maxlength: 50,
        isName: true
      }
    },
    messages: {
      name: {
        required: "Please enter your name",
        minlength: "Your name must consist of at least 3 characters",
        maxlength: "Your name must not contain more than 50 characters",
      }
    },
    errorElement: "div",
    errorPlacement: function ( error, element ) {
      errorPlacement(error, element)
    },
    highlight: function ( element, errorClass, validClass ) {
      highlight(element, errorClass, validClass)
    },
    unhighlight: function ( element, errorClass, validClass ) {
      unhighlight(element, errorClass, validClass)
    },
    submitHandler: function (form) {
      submitHandler(form)
    }
  });

  function errorPlacement(error, element ) {
    error.addClass("invalid-feedback");
    if (element.prop("type") === "checkbox") {
      error.insertAfter(element.parent("label"));
    } else {
      error.insertAfter(element);
    }
  }

  function highlight ( element, errorClass, validClass ) {
    $( element ).closest( ".form-control" ).addClass( "is-invalid" ).removeClass( "is-valid" );
  }

  function unhighlight ( element, errorClass, validClass ) {
    $( element ).closest( ".form-control" ).addClass( "is-valid" ).removeClass( "is-invalid" );
  }

  function submitHandler (form) {
    $(form).ajaxSubmit({
      contentType: 'application/json',
      success: function(res){
        console.log('Successfully Registered');
      }
    });
    return false;
  }

  $('#btn-change-email').on('click', function () {
    let newEmail = $('#email').val();

    $('#confirmChangeEmailForm').prepend('<input id="email" type="hidden" name="email" value='+ newEmail +' placeholder="Email" aria-required="true" aria-describedby="email-error" aria-invalid="false" class="form-control"/> ');
  });
});
