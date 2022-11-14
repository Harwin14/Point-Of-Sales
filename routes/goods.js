const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const { rows } = await db.query('SELECT * FROM goods')
            res.render('goodsPages/goods', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'Goods',
                user: req.session.user,
                rows
            })
        } catch (e) {
            res.send(e);
        }
    });  
    router.get('/add', isLoggedIn, async (req, res, next) => {
        res.render('goodsPages/add', {
            currentPage: 'add',
            user: req.session.user,
        })
    });
    router.post('/add', isLoggedIn, async (req, res) => {
        try {
            const { barcode, name, stock, purchaseprice, sellingprice, picture } = req.body
            console.log(barcode, name, stock, purchaseprice, sellingprice, picture)
            const { rows: goods } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
            if (goods.length > 0) {
                throw 'Goods already exist'
            }

            await db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, picture) VALUES ($1, $2, $3, $4, $5, $6)', [barcode, name, stock, purchaseprice, sellingprice, picture])
            req.flash('success', 'Goods created successfully')
            res.redirect('/goods')
          } catch (err) {
            req.flash('error', err)
            return res.redirect('/goods')
          }
        })
            return router;
        }