

const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {
    // GET & VIEW DATA
    router.get('/alert', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: notif } = await db.query('SELECT barcode, name, stock FROM goods WHERE stock <= 10')

            res.json(notif)
        } catch (err) {
            res.send(err)
        }
    });

    router.get('/count', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: count} = await db.query('SELECT COUNT(*) FROM goods WHERE stock <= 10')

            res.json(count)
        } catch (err) {
            res.send(err)
        }
    });

    return router
}