const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const router = express.Router();


module.exports = (db) => {
    router.get('/', isLoggedIn, async  (req, res, next) => {
        try {
          const { rows: suppliers } = await db.query('SELECT * FROM suppliers')
          res.render('suppliers/list', {
            success: req.flash('success'),
            error: req.flash('error'),
            currentPage: 'Data Suppliers',
            user: req.session.user,
            suppliers
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
            params.push(`address ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`phone ilike '%${req.query.search.value}%'`)
        }
       

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`select count(*) as total from suppliers${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`select * from suppliers${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }
        res.json(response)
    })
    router.get('/add', isLoggedIn, async (req, res, next) => {
      res.render('suppliers/add', {
        currentPage: 'Data Suppliers',
        user: req.session.user,
      })
    });
    router.post('/add', isLoggedIn, async (req, res) => {
      try {
        const { name, address, phone } = req.body
        console.log(name, address, phone)
        const { rows: suppliers } = await db.query('SELECT * FROM suppliers WHERE name = $1', [name])
        if (suppliers.length > 0) {
          throw 'Unit already exist'
        }
  
  
        await db.query('INSERT INTO suppliers (name, address, phone) VALUES ($1, $2, $3)', [name, address, phone])
        req.flash('success', 'Unit created successfully')
        res.redirect('/suppliers')
      } catch (err) {
        req.flash('error', err)
        return res.redirect('/suppliers')
      }
    })
    router.get('/edit/:supplierid', isLoggedIn, async (req, res, next) => {
      try {
        const { supplierid } = req.params
        const { rows } = await db.query('SELECT * FROM suppliers WHERE supplierid = $1', [supplierid])
        res.render('suppliers/edit', {
          currentPage: 'Goods Utilities',
          user: req.session.user,
          item: rows[0]
        })
      } catch (e) {
        res.send(e);
      }
    });
    router.post('/edit/:supplierid', isLoggedIn, async (req, res) => {
      try {
        const { supplierid } = req.params
        const {name, address, phone } = req.body
  
  
        await db.query('UPDATE suppliers SET name = $1, address = $2 , phone = $3 WHERE supplierid = $4', [ name, address, phone, supplierid])
  
        req.flash('success', 'Suppliers successfully edited')
        res.redirect('/suppliers')
      } catch (err) {
        req.flash('error', 'Suppliers already exist')
        return res.redirect('/suppliers')
      }
    })
    router.get('/delete/:supplierid', isLoggedIn, async (req, res, next) => {
      try {
        const { supplierid } = req.params
        await db.query('DELETE FROM suppliers WHERE supplierid = $1', [supplierid])
        req.flash('success', 'Suplliers deleted successfully')
        res.redirect('/suppliers')
      } catch (err) {
        console.log(err)
        req.flash('error', err)
        return res.redirect('/suppliers')
      }
    });

    return router;

}