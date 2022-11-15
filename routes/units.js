const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // router.get('/', isLoggedIn, async (req, res, next) => {
  //   try {
    //seaching
    // let params = []
    // let values = []
    // let count = 1

    // if (req.query.findUnit) {
    //   // ilike ignore huruf besar / kecil
    //   params.push(`unit ilike '%' || $${count++} || '%' `)
    //   values.push(req.query.findUnit)
    // }
    // if (req.query.findName) {
    //   // ilike ignore huruf besar / kecil
    //   params.push(`name ilike '%' || $${count++} || '%' `)
    //   values.push(req.query.findName)
    // }
    // if (req.query.findNote) {
    //   // ilike ignore huruf besar / kecil
    //   params.push(`note ilike '%' || $${count++} || '%' `)
    //   values.push(req.query.findNote)
    // }


    //pagination
    // const url = req.url == '/' ? '/units/?page=1 ' : `/units${req.url}`
    // let page = req.query.page || 1
    // page = Number(page)
    // const limit = req.body.limit || 3
    // const offset = (page - 1) * limit

  //   let sql = 'SELECT count(*) as total FROM units'

  //   if (params.length > 0) {
  //     sql += ` WHERE ${params.join(' OR ')}`
  //   }


  //   const { rows } = await db.query(sql, values)

  //   const total = rows[0].total
  //   const pages = Math.ceil(total / limit)

  //   sql = 'SELECT * FROM units'

  //   if (params.length > 0) {
  //     sql += ` WHERE ${params.join(' AND ')}`
  //   }

  //   sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`

  //   console.log('sql', sql)
  //   const { rows: units } = await db.query(sql, [...values, limit, offset])
  //   res.render('units/units', {
  //     success: req.flash('success'),
  //     error: req.flash('error'),
  //     currentPage: 'units',
  //     user: req.session.user,
  //     units,
  //     //  page,
  //     //  pages,
  //     //  offset,
  //     //  url,
  //      query: req.query
  //   })
  // }catch (err){
  //   console.log(err)
  //   res.send(err)
  // }
  // })
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