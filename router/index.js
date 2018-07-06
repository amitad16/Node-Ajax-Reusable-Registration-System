const express = require('express');
const router = express.Router();

const mongoose = require('../server/db/mongoose');
const { User } = require('../models/user.model');
const { ifLoggedIn, ifNotLoggedIn } = require('./helper/accessControlAndValidator');

// ROUTES////////////////////////////////////////////////////////////////
router.get('/', ifNotLoggedIn, (req, res, next) => {
  res.render('users');
});

module.exports = router;
