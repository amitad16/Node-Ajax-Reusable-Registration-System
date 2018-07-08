const express = require('express');
const router = express.Router();

const mongoose = require('../../../../server/db/mongoose');
const { User } = require('../../../../models/user.model');
const { upload } = require('../../../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../../../helper/accessControlAndValidator');

router.post('/change_password', ifLoggedIn, (req, res, next) => {
  if (req.body.new_password !== req.body.password2) {
    req.flash('error', 'Passwords don\'t match');
    return res.redirect('/users/:username/settings/account');
  }
  let oldPassword = req.body.old_password;
  User.getUserById(req.user._id, (err, user) => {
    if (err) {
      req.flash('error', 'Change Password Error: ' + err);
      return res.redirect('/users/:username/settings/account');
    }
    if (!user) {
      req.flash('error', 'No User');
      return res.redirect('/users/:username/settings/account');
    }
    let storedHashedPassword = user.password;
    User.comparePassword(oldPassword, storedHashedPassword, (isMatch) => {
      if (isMatch) {
        user.password = req.body.new_password;
        user.save()
          .then(() => {
            req.flash('success', 'Password changed successfully');
            return res.redirect('/users/:username/settings/account');
          })
          .catch(err => res.status(400).send(err));
      } else {
        req.flash('error', 'Invalid Old Password');
        return res.redirect('/users/:username/settings/account');
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
      res.status(400).redirect('/users/:username/settings/account');
    });
});


module.exports = router;
