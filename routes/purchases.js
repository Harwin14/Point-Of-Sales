const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const { currencyFormatter } = require('../helpers/util')
const router = express.Router();
const moment = require('moment');
const { query } = require('express');

module.exports = (db) => {
  router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      res.render('purchases/list', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'Purchases',
        user: req.session.user,
        currencyFormatter,
        moment
      })
    } catch (e) {
      console.log(e)
      res.send(e);
    }
  });
  router.get('/datatable', async (req, res) => {
    let params = []

    if (req.query.search.value) {
      params.push(`invoice ilike '%${req.query.search.value}%'`)
    }
    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    const data = await db.query(`select * from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
      "draw": Number(req.query.draw),
      "recordsTotal": total.rows[0].total,
      "recordsFiltered": total.rows[0].total,
      "data": data.rows
    }
    res.json(response)
  })
  // router.get('/start', isLoggedIn, async (req, res, next) => {
  //   try {
  //     const { rows: purchases } = await db.query('INSERT INTO purchases(totalsum) VALUES(0) returning * ')
  //     const { rows: goods } = await db.query('SELECT barcode, name FROM goods ORDER BY barcode')
  //     res.render('purchases/form', {
  //       currentPage: 'Purchase',
  //       user: req.session.user,
  //       purchases,
  //       goods,
  //       moment
  //     })
  //   } catch (e) {
  //     console.log(e)
  //     res.send(e);
  //   }
  // });

  router.get('/create', isLoggedIn, async (req, res, next) => {
    try {
      const  { rows }  = await db.query('INSERT INTO purchases(totalsum) VALUES(0) returning * ')
     res.redirect(`/purchases/show/${rows[0].invoice}`)
    } catch (e) {
      console.log(e)
      res.send(e);
    }
  });
  router.get('/show/:invoice', isLoggedIn, async (req, res, next) => {
    try {
      const purchases = await db.query('SELECT * FROM purchases WHERE invoice = $1', [req.params.invoice])
      const { rows } = await db.query('SELECT barcode, name FROM goods ORDER BY barcode')
     const { rows:supplier } = await db.query('SELECT name FROM suppliers ORDER BY supplierid')

      res.render('purchases/form', {
        currentPage: 'Purchases',
        user: req.session.user,
        purchases: purchases.rows[0],
        goods: rows,
        rows,
        supplier,
        moment
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/show:invoice', isLoggedIn, async (req, res) => {
    try {
      const { invoice } = req.params
      const { time, totalsum, supplier, operator} = req.body
      await db.query('UPDATE purchases SET time = $1, totalsum = $2, supplier = $3, operator = $4  WHERE invoice = $5', [time, totalsum, supplier, operator,invoice])
      await db.query('INSERT INTO public.purchases(invoice, "time", totalsum, supplier, operator)VALUES ($1, $2, $3, $4, $5)', [time, totalsum, supplier, operator,invoice])
      req.flash('success', 'Transaction success!')
      res.redirect('/purchases')
    } catch (error) {
      console.log(error)
      req.flash('error', 'Transaction Fail!')
      return res.redirect('/purchases')
    }
  })

  router.get('/goods/:barcode', isLoggedIn, async (req, res) => {
    try {
     const { barcode } = req.params
     const { rows } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode]);
     console.log(rows, barcode )
     res.json(rows[0])
    } catch (err) {
     res.send(err)
    } 
  })

  router.post('/additem', isLoggedIn, async (req, res) => {
    try {
     const { invoice, itemcode, quantity } = req.body
     const detail = await db.query('INSERT INTO purchaseitems (invoice, itemcode, quantity)VALUES ($1, $2, $3) returning *', [invoice, itemcode, quantity]);
     const { rows } = await db.query('SELECT * FROM purchases WHERE invoice = $1', [invoice])
     console.log(detail)
     res.json(rows[0])
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })

  router.get('/details/:invoice', isLoggedIn, async (req, res) => {
    try {
     const { rows } = await db.query('SELECT pi.*, g.name FROM purchaseitems as pi LEFT JOIN goods as g ON pi.itemcode = g.barcode WHERE pi.invoice = $1 ORDER BY pi.id', [req.params.invoice]);

     console.log(rows)
     res.json(rows)
    } catch (err) {
      console.log(err)
     res.send(err)
    }
  })
  router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
    try {
      const { invoice } = req.params
     const s = await db.query('DELETE FROM public.purchaseitems WHERE invoice = $1', [invoice])
      console.log(invoice, s)
      req.flash('success', 'Transaction deleted successfully')
      res.redirect('/purchases');
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/purchases')
    }
});
router.delete('/delitem/:id', isLoggedIn, async function (req, res, next) {
        try {
            const { id } = req.params
            delDetail = await db.query('DELETE FROM purchaseitems WHERE id = $1', [id])
            const { rows } = await db.query('SELECT SUM(totalsum)  AS total FROM purchaseitems WHERE invoice = $1', [invoice])
            res.json(rows)
        } catch (e) {
            console.log(e)
        }
    })


  return router;
}