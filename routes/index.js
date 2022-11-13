const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();



module.exports = function (db) {
  router.get('/', function (req, res, next) {
    res.render('login', {
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])

      if (emails.length == 0) throw `Email doesn't exist`

      if (!bcrypt.compareSync(password, emails[0].password)) throw `Password doesn't match`

      const user = emails[0]
      delete user[password]

      req.session.user = user
      res.redirect('/dashboard')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/')
    }
  })
  router.get('/dashboard', isLoggedIn, function (req, res, next) {
    db.query('SELECT * FROM users', (err, data) => {
        if (err) return res.send(err)
        res.render('dashboard', {
            currentPage: 'dashboard',
            user: req.session.user,
            users: data.rows
        })
    })
});
  router.get('/register', function (req, res, next) {
    res.render('register', {
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role } = req.body

      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (emails.length > 0) {
        throw 'Email already exist'
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('success', 'your account was created successfully, please log in')
      res.redirect('/')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/register')
    }
  })
  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  });

  router.get('/forget', function (req, res, next) {
    res.render('forget');
  });
  return router;
}