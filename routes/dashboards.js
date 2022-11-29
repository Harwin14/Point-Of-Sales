const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const router = express.Router();





module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            res.render('dashboards/list', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'POS - Data Reports',
                user: req.session.user,
            })
        } catch (e) {
            res.send(e);
        }
    });
  
    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`monthly = '%${req.query.search.value}%'`)
        }
        // SELECT t1.*, t2.* 
        // FROM
        //    (SELECT sum(totalsum) FROM purchases AS p) AS t1
        // FULL JOIN
        //    (SELECT sum(totalsum) FROM sales AS s) AS t2
        // ON false
        
       
        // SELECT t1.*, t2.* 
        // FROM
        //    (SELECT p.* FROM purchases AS p) AS t1
        // FULL JOIN
        //    (SELECT s.* FROM sales AS s) AS t2
        // ON false
        
        console.log(req.query.length)
        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`select count(*) as total from reports${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`SELECT (SELECT SUM(totalsum) FROM purchases) AS expense,(SELECT SUM(totalsum) FROM sales) AS revenue ${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
            
        }
        console.log(data)
        res.json(response)
    })
   
    
    return router;

}