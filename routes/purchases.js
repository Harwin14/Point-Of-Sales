const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const { currencyFormatter } = require('../helpers/util')
const router = express.Router();
const moment = require('moment')

module.exports = (db) => {
  router.get('/', isLoggedIn, async (req, res, next) => {
        try {
        
          //console.log(purchases)
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

router.get('/create', isLoggedIn, async  (req, res, next) => {
      try {
        const purchases = await db.query('INSERT INTO purchases(total_sum) VALUES(0) returning * ')
        res.redirect('/purchases/show/${rows[0].invoice}')
      } catch (e) {
        res.send(e);
      }
});
router.get('/show/:invoice', isLoggedIn, async  (req, res, next) => {
      try {
        const purchases = await db.query('SELECT * FROM purchases WHERE invoice = $1', [req.params.invoice] )
        const { rows: goods } = await db.query('SELECT barcode, name FROM goods ORDER BY barcode')
        res.render('purchases/form', {
            currentPage: 'Purchases',
            user: req.session.user,
            purchases: purchases.rows[0],
            goods,
            moment
        })
      } catch (e) {
        res.send(e);
      }
});



router.post('/additem', isLoggedIn, async (req, res) => {
  try {
    
    //res.json(rows)
  } catch (err) {
    return res.redirect('/purchases')
  }
})


  return router;
}