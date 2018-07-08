const express = require('express');
const router = express.Router();

const mongoose = require('../server/db/mongoose');
const { User } = require('../models/user.model');
const { upload } = require('./helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('./helper/accessControlAndValidator');

router.get('/:username', ifLoggedIn, (req, res, next) => {
  res.status(200).render('users/index', {
    title: 'Dashboard',
    user: req.user
  });
});

router.get('/:username/profile', ifLoggedIn, (req, res, next) => {
  res.render('users/profile', {
    title: 'Profile',
    user: req.user
  });
});

router.get('/:username/settings/profile', ifLoggedIn, (req, res, next) => {
  res.render('users/settings/profile', {
    title: 'Profile Setting',
    user: req.user
  });
});

router.get('/:username/settings/account', ifLoggedIn, (req, res, next) => {
  res.render('users/settings/account', {
    title: 'Account Setting',
    user: req.user
  });
});

module.exports = router;