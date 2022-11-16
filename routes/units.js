const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', isLoggedIn, async  (req, res, next) => {
    try {
      const { rows: units } = await db.query('SELECT * FROM units')
      res.render('units/list', {
        success: req.flash('success'),
        error: req.flash('error'),
        currentPage: 'Goods Utilities',
        user: req.session.user,
        units
      })
    } catch (e) {
      res.send(e);
    }
  });

  router.get('/datatable', async (req, res) => {
    let params = []

    if (req.query.search.value) {
        params.push(`unit ilike '%${req.query.search.value}%'`)
    }
    if (req.query.search.value) {
        params.push(`name ilike '%${req.query.search.value}%'`)
    }
    if (req.query.search.value) {
        params.push(`note ilike '%${req.query.search.value}%'`)
    }
   
    
    const limit = req.query.length
    const offset = req.query.start
    const sortBy = req.query.columns[req.query.order[0].column].data
    const sortMode = req.query.order[0].dir

    const total = await db.query(`select count(*) as total from units${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
    const data = await db.query(`select * from units${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
    const response = {
        "draw": Number(req.query.draw),
        "recordsTotal": total.rows[0].total,
        "recordsFiltered": total.rows[0].total,
        "data": data.rows
    }
    res.json(response)
})

  router.get('/add', isLoggedIn, async (req, res, next) => {
    res.render('units/add', {
      currentPage: 'Goods Utilities',
      user: req.session.user,
    })
  });
  router.post('/add', isLoggedIn, async (req, res) => {
    try {
      const { unit, name, note } = req.body
      console.log(unit, name, note)
      const { rows: units } = await db.query('SELECT * FROM units WHERE unit = $1', [unit])
      if (units.length > 0) {
        throw 'Unit already exist'
      }


      await db.query('INSERT INTO units (unit, name, note) VALUES ($1, $2, $3)', [unit, name, note])
      req.flash('success', 'Unit created successfully')
      res.redirect('/units')
    } catch (err) {
      req.flash('error', err)
      return res.redirect('/units')
    }
  })


  router.get('/edit/:unit', isLoggedIn, async (req, res, next) => {
    try {
      const { unit } = req.params
      const { rows } = await db.query('SELECT * FROM units WHERE unit = $1', [unit])
      res.render('units/edit', {
        currentPage: 'Goods Utilities',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/edit/:unit', isLoggedIn, async (req, res) => {
    try {
      const { unit } = req.params
      const {name, note } = req.body


      await db.query('UPDATE units SET name = $1, note = $2 WHERE unit = $3', [ name, note, unit])

      req.flash('success', 'Unit successfully edited')
      res.redirect('/units')
    } catch (err) {
      req.flash('error', 'Unit already exist')
      return res.redirect('/units')
    }
  })

  router.get('/delete/:unit', isLoggedIn, async (req, res, next) => {
    try {
      const { unit } = req.params
      await db.query('DELETE FROM units WHERE unit = $1', [unit])
      req.flash('success', 'Unit deleted successfully')
      res.redirect('/units')
    } catch (e) {
      req.flash('error', err)
      return res.redirect('/units')
    }
  });

  return router
}