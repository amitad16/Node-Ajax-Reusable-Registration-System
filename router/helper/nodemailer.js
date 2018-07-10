const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendEmailVerificationOnRegister = (req, res, user) => {
  let message = {
    from: 'fullauth@gmail.com',
    to: req.body.email,
    subject: 'FULL AUTH - EMAIL ACTIVATION',
    text: `Paste this link in your browser ${process.env.DOMAIN_NAME}/user/resetPassword/${user.token.email_activate}`,
    html: `<p>Sender Info</p>` +
    `<ul>` +
    `<li>Sender Email: ${req.body.email}</li>` +
    `<li>Click on link to activate your account: <a href="${process.env.DOMAIN_NAME}/user/activate/${user.token.email_activate}">CLICK HERE</a></li>` +
    `</ul>`
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      req.flash('error', 'Email sent error');
      return res.render('user/login', { title: 'Login' });
    }
    req.flash('success', 'Please verify your email by clicking the link we have sent you on your email');
    return res.render('user/login', {
      title: 'Login',
      'success': true
    });
  });

};

exports.sendEmailVerificationOnEmailChange = (req, res, user) => {
  let messageOldEmail = {
    from: 'fullauth@gmail.com',
    to: req.user.email,
    subject: 'FULL AUTH - EMAIL CHANGE NOTIFICATION',
    text: `Your email has been updated to ${req.body.email}. Now you will have to use your new email for all your further tasks.`,
    html: `<p>Sender Info</p>` +
    `<ul>` +
    `<li>Sender Email: ${req.body.email}</li>` +
    `<li>Your email has been updated to <em>${req.body.email}<em>. Now you will have to use your new email for all your further tasks.` +
    `</ul>`
  };

  let messageNewEmail = {
    from: 'fullauth@gmail.com',
    to: req.body.email,
    subject: 'FULL AUTH - EMAIL ACTIVATION',
    text: `Paste this link in your browser: ${process.env.DOMAIN_NAME}/user/resetPassword/${user.token.email_activate}`,
    html: `<p>Sender Info</p>` +
    `<ul>` +
    `<li>Sender Email: ${req.body.email}</li>` +
    `<li>Click on link to activate your account: <a href="${process.env.DOMAIN_NAME}/user/activate/${user.token.email_activate}">CLICK HERE</a></li>` +
    `</ul>`
  };

  transporter.sendMail(messageOldEmail, (err, info) => {
    if (err) {
      req.flash('error', 'Failed to send message to your old email: ' + err);
      return res.redirect(`/users/${req.params.username}/settings/account`);
    }
    transporter.sendMail(messageNewEmail, (err, info) => {
      if (err) {
        req.flash('error', 'Failed to send message to your new email: ' + err);
        return res.redirect(`/users/${req.params.username}/settings/account`);
      }
    });
  });
};

exports.sendResetPasswordEmail = (req, res, user) => {
  let message = {
    from: 'fullauth@gmail.com',
    to: req.body.email,
    subject: 'Password Change Request',
    text: `Paste this link in your browser ${process.env.DOMAIN_NAME}/user/resetPassword/${user.token.reset_password}`,
    html: `<p>Sender Info</p>` +
    `<ul>` +
    `<li>Sender Email: ${req.body.email}</li>` +
    `<li>Click on link: <a href="${process.env.DOMAIN_NAME}/user/resetPassword/${user.token.reset_password}">CLICK HERE</a></li>` +
    `</ul>`
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      req.flash('error', 'Email sent error');
      res.render('user/forgotPassword', { title: 'Forgot Password' });
    }
    req.flash('success', 'Check your inbox for the next steps. If you don\'t receive an email, and it\'s not in your spam folder this could mean you signed up with a different address.');
    res.render('user/forgotPassword', {
      title: 'Forgot Password',
      'success': true
    });
  });
};
