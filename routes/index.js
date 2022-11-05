var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var router = express.Router();


module.exports = function (db) {
  router.get('/', function (req, res, next) {
    res.render('login');
  });
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body
      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (emails.length == 0) return res.send(`Email doesn't exist`)

      if (!bcrypt.compareSync(password, emails[0].password)) return res.send(`Password doesn't match`)

      const user = emails[0]
      delete user[password]
      req.session.user = user
      res.redirect('/home')
    } catch (error) {
      res.send(error)
    }
  })



  router.get('/register', function (req, res, next) {
    res.render('register');
  });
  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role } = req.body
      const { rows: emails } = await db.query('SELECT * FROM public."users" WHERE email = $1', [email])
      if (emails.length > 0) return res.send(`Email already exist`)

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO public."users" (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])

      res.redirect('/')
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  })
  router.get('/home', function (req, res, next) {
    res.render('index', { user: req.session.user });
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  });

  router.get('/forget', function (req, res, next) {
    res.render('forget');
  });


  router.get('/a', function (req, res, next) {
    res.render('a');
  });

  return router;
}