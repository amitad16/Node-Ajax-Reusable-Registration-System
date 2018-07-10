const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');

const mongoose = require('../../../../server/db/mongoose');
const { User } = require('../../../../models/user.model');
const { upload } = require('../../../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../../../helper/accessControlAndValidator');
const{ sendEmailVerificationOnEmailChange } = require('../../../helper/nodemailer');

router.post('/change_password', ifLoggedIn, (req, res, next) => {
  if (req.body.new_password !== req.body.password2) {
    req.flash('error', 'Passwords don\'t match');
    return res.redirect(`/users/${req.user.username}/settings/account`);
  }
  let oldPassword = req.body.old_password;
  User.getUserById(req.user._id, (err, user) => {
    if (err) {
      req.flash('error', 'Change Password Error: ' + err);
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    if (!user) {
      req.flash('error', 'No User');
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    let storedHashedPassword = user.password;
    User.comparePassword(req.body.new_password, storedHashedPassword, (isMatch) => {
      if (isMatch) {
        req.flash('error', 'You cannot provide same password again');
        return res.redirect(`/users/${req.user.username}/settings/account`);
      } else {
        User.comparePassword(oldPassword, storedHashedPassword, (isMatch) => {
          if (isMatch) {
            user.password = req.body.new_password;
            user.save()
              .then(() => {
                req.flash('success', 'Password changed successfully');
                return res.redirect(`/users/${req.user.username}/settings/account`);
              })
              .catch(err => res.status(400).send(err));
          } else {
            req.flash('error', 'Invalid Old Password');
            return res.redirect(`/users/${req.user.username}/settings/account`);
          }
        });
      }
    });
  });
});

router.post('/change_username', ifLoggedIn, (req, res) => {
  let newUsername = req.body.username;
  User.getUserById(req.user.id, { 'username': 1, '_id': 0 }, (err, user) => {
    if (err) {
      req.flash('error', 'Change username error: ' + err);
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    if (!user) {
      req.flash('error', 'No user exists');
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    if (user.username === newUsername) {
      req.flash('error', 'You cannot provide same username again');
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    User.findByIdAndUpdate(req.user.id, { '$set': { 'username': newUsername } })
      .then(() => {
        req.flash('success', 'Successfully updated username');
        return res.redirect(`/users/${req.user.username}/settings/account`);
      })
      .catch(err => {
        req.flash('error', 'Username update failed: ' + err);
        return res.redirect(`/users/${req.user.username}/settings/account`);
      })
  });
});

router.post('/change_email', ifLoggedIn, (req, res) => {
  let password = req.body.password;
  let newEmail = req.body.email;

  User.getUserById(req.user.id, { 'email': 1, 'password': 1, '_id': 0 }, (err, user) => {
    if (err) {
      req.flash('error', 'Change email error: ' + err);
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    if (!user) {
      req.flash('error', 'No user exists');
      return res.redirect(`/users/${req.user.username}/settings/account`);
    }
    User.comparePassword(password, user.password, (isMatch) => {
      if (!isMatch) {
        req.flash('error', 'Wrong Password');
        return res.redirect(`/users/${req.user.username}/settings/account`);
      } else {
        if (user.email === newEmail) {
          req.flash('error', 'You cannot provide same email again');
          return res.redirect(`/users/${req.user.username}/settings/account`);
        }
        const emailActivateToken = jwt.sign({email: req.body.email.toString(), access: 'email_activate'}, process.env.JWT_SECRET).toString();

        User.findByIdAndUpdate(req.user.id,
          {'$set': { 'email': newEmail, 'token.email_activate': emailActivateToken, 'active': false }},
          { 'new': true, 'projection': { 'token.email_activate': 1 } })
          .then((user) => {
            sendEmailVerificationOnEmailChange(req, res, user);
            req.flash('success', 'Successfully updated username');
            return res.redirect(`/users/${req.user.username}/settings/account`);
          })
          .catch(err => {
            req.flash('error', 'Email update failed: ' + err);
            return res.redirect(`/users/${req.user.username}/settings/account`);
          });
      }
    });
  });
});

router.post('/delete', ifLoggedIn, (req, res) => {
  User.deleteAccountById(req.user.id)
    .then(() => {
      req.logout();
      req.flash('success', 'Your account is successfully deleted. We wish to see you soon.');
      res.status(200).redirect('/');
    })
    .catch(err => {
      req.flash('error', 'Your account cannot be deleted due to: ' + err);
      res.status(400).redirect(`/users/${req.user.username}/settings/account`);
    });
});


module.exports = router;
