const express = require('express');
const { isLoggedIn } = require('../helpers/util')
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

    router.get('/users', isLoggedIn, async function (req, res, next) {
        try {
            const { rows } = await db.query('SELECT * FROM public."users"')
            res.render('dashboard/users', {
                currentPage: 'users',
                user: req.session.user,
                rows
            })
        } catch (e) {
            res.send(e);
        }
    });
    router.get('/add', isLoggedIn, async function (req, res, next) {
        try {
            const { rows } = await db.query('SELECT * FROM public."users"')
            res.render('dashboard/add', {
                currentPage: 'users',
                user: req.session.user,
                rows
            })
        } catch (e) {
            res.send(e);
        }
    });
    return router
}