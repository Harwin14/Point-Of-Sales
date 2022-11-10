const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const { isLoggedIn } = require('../helpers/util')


module.exports = function (db) {
 
  router.get('/users',isLoggedIn, function (req, res, next) {
    res.render('users');
  });

  return router;
}