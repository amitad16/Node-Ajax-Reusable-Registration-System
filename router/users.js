const express = require('express');
const router = express.Router();

const mongoose = require('../server/db/mongoose');
const { User } = require('../models/user.model');
const { upload } = require('./helper/multerConfigurations');
const { ifLoggedIn, ifNotLoggedIn } = require('./helper/accessControlAndValidator');

router.get('/:username', ifLoggedIn, (req, res, next) => {
  User.findOne({ username: req.user.username })
    .select({name: 1, username: 1, email: 1, 'profileImg.filename': 1})
    .exec()
    .then(user => {
      res.status(200).render('index', { user });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;