const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', isLoggedIn, (req, res, next) => {
    
    const url = req.url == '/' ? '/units/?page=1 ' : `/units${req.url}`
  
    let page = req.query.page || 1
    page = Number(page)
    const limit = 3
    const offset = (page - 1) * limit

    db.query('SELECT count(*) as total FROM units', (err, data) => {
      if (err) return res.send(err)

      const total = data.rows[0].total
      const pages = Math.ceil(total / limit)

      db.query('SELECT * FROM units LIMIT $1 OFFSET $2', [limit, offset], (err, data) => {
        if (err) return res.send(err)
        res.render('unitsPages/units', {
          success: req.flash('success'),
          error: req.flash('error'),
          currentPage: 'users',
          user: req.session.user,
          units: data.rows,
          page,
          pages,
          offset,
          url,
        
        })
      })
    })
  })




  router.get('/add', isLoggedIn, async (req, res, next) => {
    res.render('unitsPages/add', {
      currentPage: 'add',
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


  router.get('/edit/:id', isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params
      const { rows } = await db.query('SELECT * FROM units WHERE id = $1', [id])
      res.render('unitsPages/edit', {
        currentPage: 'edit',
        user: req.session.user,
        item: rows[0]
      })
    } catch (e) {
      res.send(e);
    }
  });
  router.post('/edit/:id', isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params
      const { unit, name, note } = req.body


      await db.query('UPDATE units SET unit = $1, name = $2, note = $3 WHERE id = $4', [unit, name, note, id])

      req.flash('success', 'Unit successfully edited')
      res.redirect('/units')
    } catch (err) {
      req.flash('error', 'Unit already exist')
      return res.redirect('/units')
    }
  })

  router.get('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.body
      console.log(id)
      await db.query('DELETE FROM units WHERE id = $1', [id])
      req.flash('success', 'Unit deleted successfully')
      res.redirect('/units')
    } catch (e) {
      req.flash('error', err)
      return res.redirect('/units')
    }
  });

  return router
}