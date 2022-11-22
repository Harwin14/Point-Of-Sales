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
//    const data = await db.query(`select * from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const data = await db.query(`SELECT p.*, s.* FROM purchases as p LEFT JOIN suppliers as s ON p.supplier = s.supplierid${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
      "draw": Number(req.query.draw),
      "recordsTotal": total.rows[0].total,
      "recordsFiltered": total.rows[0].total,
      "data": data.rows
    }
    res.json(response)
  })
 

  router.get('/create', isLoggedIn, async (req, res, next) => {
    try {
      const  { rows }  = await db.query('INSERT INTO purchases(totalsum) VALUES(0) returning *')
      res.redirect(`/purchases/show/${rows[0].invoice}`)
    } catch (e) {
      console.log(e)
      res.send(e);
    }
  });
  router.get('/show/:invoice', isLoggedIn, async (req, res, next) => {
    try {
      const  purchases  = await db.query('SELECT * FROM purchases WHERE invoice = $1', [req.params.invoice])
      const { rows: goods } = await db.query('SELECT barcode, name FROM goods ORDER BY barcode')
      const { rows } = await db.query('SELECT * FROM suppliers ORDER BY supplierid')
      console.log(rows)
     // const invoice = req.body.invoice || rows.length > 0 ? rows[0].invoice : ''
     // const data = await db.query('SELECT g.barcode, g.name, pi.quantity, pi.purchaseprice, pi.totalprice, g.barcode, g.name FROM purchaseitems as pi LEFT JOIN goods as g ON pi.itemcode = g.barcode WHERE pi.invoice = $1 ORDER BY pi.purchaseprice ',[invoice])
      res.render('purchases/form', {
        currentPage: 'Purchases',
        user: req.session.user,
        purchases: purchases.rows[0],
        goods,
        supplier: rows,
        moment,
        //data: data.rows
      })
    } catch (e) {
      res.send(e);
    } 
  }); 

  router.post('/show/:invoice', isLoggedIn, async (req, res) => {
    try {
      const { invoice } = req.params
      const {  totalsum, supplier, operator } = req.body
    const a = await db.query('UPDATE purchases SET  totalsum = $1, supplier = $2, operator = $3  WHERE invoice = $4',[ totalsum, supplier, operator, invoice])
   
      console.log(a)
      req.flash('success', 'Transaction Success!')
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
     //console.log(rows, barcode )
     res.json(rows[0])
    } catch (err) {
     res.send(err)
    }  
  })

  router.post('/additem', isLoggedIn, async (req, res) => {
    try {
     const { invoice, itemcode, quantity } = req.body
     await db.query('INSERT INTO purchaseitems (invoice, itemcode, quantity)VALUES ($1, $2, $3) returning *', [invoice, itemcode, quantity]);
     const { rows } = await db.query('SELECT * FROM purchases WHERE invoice = $1', [invoice])
    // console.log(detail)
     res.json(rows[0])
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  })

  // router.get('/details/:invoice', isLoggedIn, async (req, res) => {
  //   try {
  //    const { invoice } = req.params
  //    const  data  = await db.query('SELECT purchaseitems.*, Goods.name FROM purchaseitems  LEFT JOIN Goods ON purchaseitems.itemcode = Goods.barcode WHERE purchaseitems.invoice = $1 ORDER BY purchaseitems.id', [invoice]);
  //    const response = {
  //     "data": data.rows }
  //    console.log(response)
  //    res.json(response)
  //   } catch (err) {
  //     console.log(err)
  //    res.send(err)
  //   }
  // })
  router.get('/details/:invoice', isLoggedIn, async (req, res, next) => {
    try {
        const { invoice } = req.params
        const { rows: data } = await db.query('SELECT purchaseitems.*, goods.name FROM purchaseitems LEFT JOIN goods ON purchaseitems.itemcode = goods.barcode WHERE purchaseitems.invoice = $1 ORDER BY purchaseitems.id', [invoice])

        res.json(data)
    } catch (err) {
        console.log(err)
    }
});
  router.get('/delete/:invoice', isLoggedIn, async (req, res, next) => {
    try {
      const { invoice } = req.params
     const s = await db.query('DELETE FROM purchaseitems WHERE invoice = $1', [invoice])
     //const s = await db.query('DELETE FROM purchases as p LEFT OUTER JOIN suppliers as s ON p.supplier = s.supplierid WHERE  p.invoice = $1', [invoice])

      console.log(invoice, s)
      req.flash('success', 'Transaction deleted successfully')
      res.redirect('/purchases');
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/purchases')
    }
});
router.get('/deleteitems/:id', isLoggedIn, async (req, res, next) => {
  try {
      const { id } = req.params
      const { rows: data } = await db.query('DELETE FROM purchaseitems WHERE id = $1 returning *', [id])

      console.log(data)
      res.redirect(`/purchases/show/${data[0].invoice}`)
  } catch (err) {
      console.log(err)
  }
});
  return router;
}  