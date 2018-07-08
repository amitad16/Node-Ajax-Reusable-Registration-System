const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const mongoose = require('../../server/db/mongoose');
const { User } = require('../../models/user.model');
const { upload } = require('../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../helper/accessControlAndValidator');
const passportConfig = require('../helper/passport');

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

router.get('/resetPassword/:resetToken', ifNotLoggedIn, (req, res, next) => {
  const resetToken = req.params.resetToken;
  res.render('user/resetPassword', {
    title: 'Reset Password',
    resetToken
  });
});

// Process Register
router.post('/register', ifNotLoggedIn, upload, (req, res, next) => {
  const userInfo = req.body;
  delete userInfo.password2;
  userInfo.profileImg = req.file;
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
        res.render('user/register', {
          title: 'Register',
          errors
        });
      }
    } else {
      req.flash('success', 'You are registered and can login');
      res.redirect('/user/login');
    }
  });
});

// Passport Configurations
passportConfig.passportConfig();

router.post('/login', ifNotLoggedIn, (req, res, next) => {
  // console.log(req);
  passport.authenticate('local', {
    successRedirect: `/users/${req.body.username}`,
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});


// Forgot Password
router.post('/forgotPassword', ifNotLoggedIn, (req, res) => {
  const resetToken = jwt.sign({email: req.body.email.toString(), access: 'resetpassword'}, process.env.JWT_SECRET, { expiresIn: '24h' }).toString();
  return new Promise((resolve, reject) => {
    User.findOne({ 'email': req.body.email }, { 'email': 1, '_id': 0 })
      .then(user => {
        resolve(user);
      });
  }).then((user) => {
    if (user) {
      User.findOneAndUpdate(
        { 'email': req.body.email },
        { '$set': { 'resetToken': resetToken } },
        { 'new': true, 'projection': { 'resetToken': 1 } })
        .then((user) => {
          let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASSWORD
            }
          });

          let message = {
            from: 'passportlogin@gmail.com',
            to: req.body.email,
            subject: 'Password Change Request',
            text: `Paste this link in your browser http://localhost:3000/user/resetPassword/${user.resetToken}`,
            html: `<p>Sender Info</p>` +
            `<ul>` +
            `<li>Sender Email: ${req.body.email}</li>` +
            `<li>Click on link: <a href="http://localhost:3000/user/resetPassword/${user.resetToken}">CLICK HERE</a></li>` +
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
        })
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

router.post('/resetPassword/:resetToken', ifNotLoggedIn, (req, res, next) => {
  const resetToken = req.params.resetToken;
  const newPassword = req.body.password;

  jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      User.findOneAndUpdate({'resetToken': resetToken}, {'$unset': {'resetToken': 1}})
        .then(() => {
          req.flash('error', 'Token Expired, write email again');
          res.redirect('/user/forgotPassword');
        });
    } else {
      User.findOneAndUpdate({ 'resetToken': resetToken }, { '$unset': { 'resetToken': 1 } }, { 'new': true })
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
      return new Error('Server Error');
    if (user) {
      console.log(req.user);
      if (req.user)
        if (req.user.email === user.email)
          res.write('"true"');
      else
        res.write('""');
    } else {
      res.write('"true"');
    }
    res.end();
  });
});

router.get('/scripts/usernameExists', (req, res) => {
  User.findOne({ 'username': req.query.username }).exec((err, user) => {
    if (err)
      return new Error('Server Error');
    if (user) {
      console.log(req.user);
      if (req.user)
        if (req.user.username === user.username)
          res.write('"true"');
      else
        res.write('""');
    } else {
      res.write('"true"');
    }
    res.end();
  });
});

module.exports = router;
