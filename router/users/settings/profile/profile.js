const express = require('express');
const router = express.Router({ mergeParams: true });

const mongoose = require('../../../../server/db/mongoose');
const { User } = require('../../../../models/user.model');
const { upload } = require('../../../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../../../helper/accessControlAndValidator');

// TODO: Delete previous profile image from uploads
router.post('/profile_img', ifLoggedIn, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      req.flash('error', err);
      return res.redirect(`/users/${req.user.username}/settings/profile`);
    } else {
      if (req.file === undefined) {
        req.flash('error', 'No file selected');
        return res.redirect(`/users/${req.user.username}/settings/profile`);
      } else if (req.file) {
        User.findByIdAndUpdate(req.user.id, { 'profileImg': req.file }, { 'new': true, 'projection': { 'profileImg.filename': 1 } })
          .then(() => {
            req.flash('success', 'Successfully changed profile image');
            return res.redirect(`/users/${req.user.username}/settings/profile`);
          })
          .catch(err => {
            req.flash('error', 'Image change error: ', err);
            return res.redirect(`/users/${req.user.username}/settings/profile`);
          })
      } else {
        req.flash('error', 'Image change error: ');
        return res.redirect(`/users/${req.user.username}/settings/profile`);
      }
    }
  });
});

router.post('/change_name', ifLoggedIn, (req, res) => {
  let newName = req.body.name;
  User.findByIdAndUpdate(req.user.id, { '$set': { 'name': newName } })
    .then(() => {
      req.flash('success', 'Successfully updated name');
      return res.redirect(`/users/${req.user.username}/settings/profile`);
    })
    .catch(err => {
      req.flash('error', 'Name update failed: ' + err);
      return res.redirect(`/users/${req.user.username}/settings/profile`);
    });
});


module.exports = router;
