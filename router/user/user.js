const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const mongoose = require('../../server/db/mongoose');
const { User } = require('../../models/user.model');
const { upload } = require('../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../helper/accessControlAndValidator');
const passportConfig = require('../helper/passport');
const{ sendEmailVerificationOnRegister, sendResetPasswordEmail } = require('../helper/nodemailer');

// Register Form
router.get('/register', ifNotLoggedIn, (req, res, next) => {
  res.render('user/register', { title: 'Register' });
});

// Login Form
router.get('/login', ifNotLoggedIn, (req, res, next) => {
  res.render('user/login', { title: 'Login' });
});

router.get('/logout', ifLoggedIn, (req, res, next) => {
  req.logout();
  req.flash('success', 'You are successfully logged out');
  res.redirect('/user/login');
});

router.get('/forgotPassword', ifNotLoggedIn, (req, res, next) => {
  res.render('user/forgotPassword', { title: 'Forgot Password' });
});

router.get('/resetPassword/:resetPasswordToken', ifNotLoggedIn, (req, res, next) => {
  const resetPasswordToken = req.params.resetPasswordToken;
  res.render('user/resetPassword', {
    title: 'Reset Password',
    resetPasswordToken
  });
});

// Process Register
router.post('/register', ifNotLoggedIn, (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      req.flash('error', err);
      return res.redirect(`/user/register`);
    } else {
      const userInfo = req.body;
      delete userInfo.password2;
      userInfo.profileImg = req.file;
      userInfo.active = false;
      const user = new User(userInfo);

      user.save((err) => {
        if (err) {
          if (err.errors !== null) {
            if (err.errors.name) {
              errors.name = { msg: err.errors.name.message };
            }
            if (err.errors.username) {
              errors.username = { msg: err.errors.username.message };
            }
            if (err.errors.email) {
              errors.email = { msg: err.errors.email.message };
            }
            if (err.errors.password) {
              errors.password = { msg: err.errors.password.message };
            }
            return res.render('user/register', {
              title: 'Register',
              errors
            });
          }
        } else {
          const emailActivateToken = jwt.sign({email: req.body.email.toString(), access: 'email_activate'}, process.env.JWT_SECRET).toString();
          User.findOneAndUpdate(
            { 'email': req.body.email },
            { '$set': { 'token.email_activate': emailActivateToken } },
            { 'new': true, 'projection': { 'token.email_activate': 1 } })
            .then((user) => {
              sendEmailVerificationOnRegister(req, res, user);
            });
        }
      });
    }
  });
});

router.get('/activate/:activate_email', (req, res) => {
  const activateEmailToken = req.params.activate_email;
  User.findOneAndUpdate({ 'token.email_activate': activateEmailToken }, { '$set': { 'active': true }, '$unset': { 'token.email_activate': 1 } })
    .then(() => {
      req.flash('success', 'Your email is successfully verified.');
      res.render('message');
    })
    .catch(err => {
      req.flash('error', 'Email verification failed: ' + err);
      res.render('message');
    });
});

// Passport Configurations
passportConfig.passportConfig();

router.post('/login', ifNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: `/users/${req.body.username}`,
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});


// Forgot Password
router.post('/forgotPassword', ifNotLoggedIn, (req, res) => {
  const resetPasswordToken = jwt.sign({email: req.body.email.toString(), access: 'reset_password'}, process.env.JWT_SECRET, { expiresIn: '24h' }).toString();
  return new Promise((resolve, reject) => {
    User.findOne({ 'email': req.body.email }, { 'email': 1, '_id': 0 })
      .then(user => {
        resolve(user);
      });
  }).then((user) => {
    if (user) {
      User.findOneAndUpdate(
        { 'email': req.body.email },
        { '$set': { 'token.reset_password': resetPasswordToken } },
        { 'new': true, 'projection': { 'token.reset_password': 1 } })
        .then((user) => {
          sendResetPasswordEmail(req, res, user);
        });
    } else {
      req.flash('success', 'Check your inbox for the next steps. If you don\'t receive an email, and it\'s not in your spam folder this could mean you signed up with a different address.');
      res.render('user/forgotPassword', {
        title: 'Forgot Password',
        'success': true
      });
    }
    })
    .catch(err => {
      req.flash('error', `Some error occured: ${err}`);
      res.render('user/forgotPassword', { title: 'Forgot Password' });
    });
});

router.post('/resetPassword/:resetPasswordToken', ifNotLoggedIn, (req, res, next) => {
  const resetPasswordToken = req.params.resetPasswordToken;
  const newPassword = req.body.password;

  jwt.verify(resetPasswordToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      User.findOneAndUpdate({'token.reset_password': resetPasswordToken}, {'$unset': {'token.reset_password': 1}})
        .then(() => {
          req.flash('error', 'Token Expired, write email again: ' + err);
          res.redirect('/user/forgotPassword');
        });
    } else {
      User.findOneAndUpdate({ 'token.reset_password': resetPasswordToken }, { '$unset': { 'token.reset_password': 1 } }, { 'new': true })
        .then(user => {
          if (!user) {
            req.flash('error', 'Please send new mail <a href="http://localhost:3000/forgotPassword">http://localhost:3000/forgotPassword</a>');
            res.redirect('/user/forgotPassword');
          }
          user.password = newPassword;
          user.save()
            .then(() => {
              req.flash('success', 'Password changed successfully can login');
              res.redirect('/user/login');
            })
            .catch(err => res.status(400).send(err));
        });
    }
  });
});

router.get('/scripts/emailExists', (req, res) => {
  User.findOne({ 'email': req.query.email }).exec((err, user) => {
    if (err)
      return next(new Error('Server Error'));
    if (user) {
      if (req.user) {
        if (req.user.email === user.email)
          res.write('"true"');
        else
          res.write('""');
      } else {
        res.write('""')
      }
    } else {
      res.write('"true"');
    }
    res.end();
  });
});

router.get('/scripts/usernameExists', (req, res) => {
  User.findOne({ 'username': req.query.username }).exec((err, user) => {
    if (err)
      return next(new Error('Server Error'));
    if (user) {
      if (req.user) {
        if (req.user.username === user.username)
          res.write('"true"');
        else
          res.write('""');
      } else {
        res.write('""')
      }
    } else {
      res.write('"true"');
    }
    res.end();
  });
});

module.exports = router;
