const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const router = express.Router();


module.exports = (db) => {
    router.get('/', isLoggedIn, async  (req, res, next) => {
        try {
          res.render('customers/list', {
            success: req.flash('success'),
            error: req.flash('error'),
            currentPage: 'POS - Data Customers',
            user: req.session.user
      
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

        const total = await db.query(`select count(*) as total from customers${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`select * from customers${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }
        res.json(response)  
    })
    router.get('/add', isLoggedIn, async (req, res, next) => {
      res.render('customers/add', {
        currentPage: 'POS - Data Customers',
        user: req.session.user,
      })
    });
    router.post('/add', isLoggedIn, async (req, res) => {
      try {
        const { name, address, phone } = req.body
        const { rows: customers } = await db.query('SELECT * FROM customers WHERE name = $1', [name])
        if (customers.length > 0) {
          throw 'Customer already exist'
        }
  
  
        await db.query('INSERT INTO customers (name, address, phone) VALUES ($1, $2, $3)', [name, address, phone])
        req.flash('success', 'Customer created successfully')
        res.redirect('/customers')
      } catch (err) {
        req.flash('error', err)
        return res.redirect('/customers')
      }
    })
    router.get('/edit/:customerid', isLoggedIn, async (req, res, next) => {
      try {
        const { customerid } = req.params
        const { rows } = await db.query('SELECT * FROM customers WHERE customerid = $1', [customerid])
        res.render('customers/edit', {
          currentPage: 'POS - Data Customers',
          user: req.session.user,
          item: rows[0]
        })
      } catch (e) {
        res.send(e);
      }
    });
    router.post('/edit/:customerid', isLoggedIn, async (req, res) => {
      try {
        const { customerid } = req.params
        const {name, address, phone } = req.body
  
  
        await db.query('UPDATE customers SET name = $1, address = $2 , phone = $3 WHERE customerid = $4', [ name, address, phone, customerid])
  
        req.flash('success', 'Customers successfully edited')
        res.redirect('/customers')
      } catch (err) {
        req.flash('error', 'Customers already exist')
        return res.redirect('/customers')
      }
    })
    router.get('/delete/:customerid', isLoggedIn, async (req, res, next) => {
      try {
        const { customerid } = req.params
        await db.query('DELETE FROM customers WHERE customerid = $1', [customerid])
        req.flash('success', 'Customers deleted successfully')
        res.redirect('/customers')
      } catch (err) {
        req.flash('error', err)
        return res.redirect('/customers')
      }
    });

    return router;

}