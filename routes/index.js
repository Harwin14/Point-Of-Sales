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
      res.redirect('dashboard/index')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/')
    }
  })

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

  router.get('/users', isLoggedIn, async function (req, res, next) {
    try {
      const { rows } = await db.query('SELECT * FROM users')
      res.render('dashboard/users', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'users',
        user: req.session.user,
        rows
      })
    } catch (e) {
      res.send(e);
    }
  });


  router.get('/add', isLoggedIn, async function (req, res, next) {
    res.render('dashboard/add', {
      currentPage: 'add',
      user: req.session.user,
    })

  });

  router.post('/add', isLoggedIn, async (req, res) => {
    try {
      const { email, name, password, role } = req.body
      console.log(email, name, password, role)
      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (emails.length > 0) {
        throw 'Email already exist'
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('success', 'Account was created successfully')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/add')
    }
  })

  
  router.get('/edit/:userid', isLoggedIn, async  (req, res, next) => {
    try {
      const { userid } = req.params
      const { rows } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
      res.render('dashboard/edit', {
        currentPage: 'edit',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });
  // router.get('/edit/:userid', isLoggedIn, async  (req, res, next) => {
  //   try {
  //     const { userid } = req.params
  //     const { rows: data } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
  //     res.render('dashboard/edit', {
  //       currentPage: 'edit',
  //       user: req.session.user,
  //       item: data[0]
  //     })
  //   } catch (e) {
  //     res.send(e);
  //   }
  // });
  router.post('/edit/:userid', isLoggedIn, async (req, res) => {
    try {
      const { userid } = req.params
      const { email, name, password, role } = req.body
      console.log(email, name, password, role)

      await db.query('UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4',[email, name, role, userid])
     
      req.flash('success', 'Account has been successfully edited')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/users')
    }
  })

  router.get('/delete/:userid', isLoggedIn, async  (req, res, next) => {
    try {
      const { userid } = req.params
      await db.query('DELETE FROM users WHERE userid = $1', [userid])
      req.flash('success', 'Account deleted successfully')
      res.redirect('/users')
    } catch (e) {
      req.flash('error', err)
      return res.redirect('/users')
    }
  });
  return router;
}