const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

module.exports = function (db) {
    router.get('/index', isLoggedIn, function (req, res, next) {
        db.query('SELECT * FROM public."users"', (err, data) => {
            if (err) return res.send(err)
            res.render('dashboard/index', {
                currentPage: 'dashboard',
                user: req.session.user,
                users: data.rows
            })
        })
    });

//     router.get('/users', isLoggedIn, async function (req, res, next) {
//         try {
//             const { rows } = await db.query('SELECT * FROM public."users"')
//             res.render('dashboard/users', {
//                 success: req.flash('success'),
//                 error: req.flash('error'),
//                 currentPage: 'users',
//                 user: req.session.user,
//                 rows
//             })
//         } catch (e) {
//             res.send(e);
//         }
//     });
//     router.get('/add', isLoggedIn, async function (req, res, next) {
//             res.render('dashboard/add', {
//                 currentPage: 'users',
//                 user: req.session.user,   
//             })
    
//     });
//     router.post('/add',isLoggedIn, async (req, res) => {
//     try {
//       const { email, name, password, role } = req.body
//     //  console.log(email, name, password, role)
//       const { rows: emails } = await db.query('SELECT * FROM users WHERE email = $1', [email])
//       if (emails.length > 0) {
//         throw 'Email already exist'
//       }
      
//       const hash = bcrypt.hashSync(password, saltRounds)
//       await db.query('INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4)', [email, name, hash, role])
//       req.flash('success', 'your account was created successfully,')
//       res.redirect('/add')
//     } catch (err) {
//         req.flash('error', err)
//         return res.redirect('/add')  
//     }
//   })

    return router
}