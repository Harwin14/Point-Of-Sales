const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

module.exports = (db) => {
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      res.render('users/list', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Data Users',
        user: req.session.user,
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.get('/datatable', async (req, res) => {
    let params = []

    if (req.query.search.value) {
      params.push(`name ilike '%${req.query.search.value}%'`)
    }
    if (req.query.search.value) {
      params.push(`email ilike '%${req.query.search.value}%'`)
    }


    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    const data = await db.query(`select * from users${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
      "draw": Number(req.query.draw),
      "recordsTotal": total.rows[0].total,
      "recordsFiltered": total.rows[0].total,
      "data": data.rows
    }
    res.json(response)
  })

  router.get('/add', isLoggedIn, async (req, res, next) => {
    res.render('users/add', {
      currentPage: 'POS - Data Users',
      user: req.session.user,
    })
  });
  router.post('/add', isLoggedIn, async (req, res) => {
    try {
      const { email, name, password, role } = req.body

      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      if (emails.length > 0) {
        throw 'User already exist'
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('success', 'Account created successfully')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/users')
    }
  })


  router.get('/edit/:userid', isLoggedIn, async (req, res, next) => {
    try {
      const { userid } = req.params
      const { rows } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
      res.render('users/edit', {
        currentPage: 'POS - Data Users',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/edit/:userid', isLoggedIn, async (req, res) => {
    try {
      const { userid } = req.params
      const { email, name, role } = req.body
      // const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      // if (users.length > 0) {
      //   throw 'User already exist'
      // }

      await db.query('UPDATE users SET email = $1, name = $2, role = $3 WHERE userid = $4', [email, name, role, userid])
      req.flash('success', 'Account edited successfully')
      res.redirect('/users')
    } catch (err) {
      req.flash('error', 'User already exist')
      return res.redirect('/users')
    }
  })

  router.get('/delete/:userid', isLoggedIn, async (req, res, next) => {
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
  router.get('/profile', isLoggedIn, async (req, res, next) => {
    try {
   
     
      let user = req.session.user
      let userid = user.userid

      const { rows: users } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
      res.render('users/profile', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Data Users',
        user: req.session.user,
        users
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/profile', isLoggedIn, async (req, res) => {
    try {

      let user = req.session.user
      let userid = user.userid
      const { email, name } = req.body
      await db.query('UPDATE users SET email = $1, name = $2 WHERE userid = $3 returning *', [email, name, userid])
     
      const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
      const data = emails[0]
      req.session.user = data
      req.session.save()
      req.flash('success', 'Profile edited successfully')
      res.redirect('/users/profile')
    } catch (err) {
      console.log(err)
      req.flash('error', 'Profile with that email already exist [please change email too]')
      return res.redirect('/users/profile')
    }
  })
  // router.post('/profile', isLoggedIn, async (req, res) => {
  //   try {
  //     let user = req.session.user
  //     let userid = user.userid
  //     const { email, name } = req.body
  //     const { rows: users } = await db.query('SELECT * FROM users WHERE email = $1', [email])
  //     console.log(users)
  //     if (users.length > 0) throw 'User already exist'
  //     //masalahnya kalo mau ganti namanya saja maka muncul 'error', 'Profile with that email already exist'

  //     await db.query('UPDATE users SET email = $1, name = $2 WHERE userid = $3', [email, name, userid])

  //     req.flash('success', 'Profile edited successfully')
  //     res.redirect('/users/profile')
  //   } catch (err) {
  //     console.log(err)
  //     req.flash('error', 'Profile with that email already exist [please change email too]')
  //     return res.redirect('/users/profile')
  //   }
  // })
  router.get('/changepassword', isLoggedIn, async (req, res, next) => {
    try {
      res.render('users/changepassword', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'POS - Data Users',
        user: req.session.user
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/changepassword', isLoggedIn, async (req, res) => {
    try {
      let user = req.session.user
      let userid = user.userid
      const { oldpassword, newpassword, repassword } = req.body
      const { rows } = await db.query('SELECT * FROM users WHERE userid = $1', [userid])
    

      if (newpassword != repassword)  throw "Retype Password, New password doesn't match"
      
     // if (rows[0].password !== oldpassword) throw 'password wrong'
      
     if (!bcrypt.compareSync(oldpassword, rows[0].password)) throw `Your Old password is wrong`

      const hash = bcrypt.hashSync(newpassword, saltRounds)
      const { s } = await db.query('UPDATE users set password = $1 WHERE userid = $2', [hash, userid])
      console.log('update',s)
      req.flash('success', 'Your password has been updated')
      res.redirect('/users/changepassword')
    } catch (err) { 
      req.flash('error',err)
      console.log('inierror', err)
      return res.redirect('/users/changepassword') 
    }
  })
  return router
}