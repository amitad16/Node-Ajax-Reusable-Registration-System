const express = require('express');
const router = express.Router();

const mongoose = require('../../../server/db/mongoose');
const { User } = require('../../../models/user.model');
const { upload } = require('../../helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('../../helper/accessControlAndValidator');

router.get('/profile', ifLoggedIn, (req, res, next) => {
  res.render('users/settings/profile', {
    title: 'Profile Setting',
    user: req.user
  });
});

router.get('/account', ifLoggedIn, (req, res, next) => {
  res.render('users/settings/account', {
    title: 'Account Setting',
    user: req.user
  });
});

module.exports = router;
