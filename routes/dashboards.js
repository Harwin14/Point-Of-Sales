const express = require('express');
const { isLoggedIn } = require('../helpers/util')
const router = express.Router();
const currencyFormatter = require('currency-formatter');




module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {

            const report = await db.query(`SELECT (SELECT SUM(totalsum) FROM purchases) AS purchases,(SELECT SUM(totalsum) FROM sales) AS sales`)
            const { rows: totalsales } = await db.query('SELECT COUNT(*) AS total FROM sales')

            res.render('dashboards/list', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'POS - Data Reports',
                user: req.session.user,
                report,
                currencyFormatter,
                totalsales
            })
        } catch (e) {
            res.send(e);
        }
    });
  
    router.get('/chart', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: direct } = await db.query('SELECT COUNT(*) FROM sales WHERE customer = 1')
            const { rows: member } = await db.query('SELECT COUNT(*) FROM sales WHERE customer != 1')
           
            const { rows: expense } = await db.query(`SELECT to_char(time, 'mon YY')AS monthly, to_char(time, 'MM YY')AS forsort,sum(totalsum)AS expense from purchases GROUP BY monthly, forsort ORDER BY forsort`)
            const { rows: revenue } = await db.query(`SELECT to_char(time, 'mon YY')AS monthly, to_char(time, 'MM YY')AS forsort,sum(totalsum)AS revenue from sales GROUP BY monthly, forsort ORDER BY forsort`)
            res.json({ member, direct, expense, revenue })
        } catch (error) {
            console.log(error)
        }
    });
    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`monthly = '%${req.query.search.value}%'`)
        }


        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir
        const total = await db.query(`select count(*) as total from purchases${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        //  ${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `

        const rows = await db.query(`SELECT to_char(time, 'mon YY')AS monthly, to_char(time, 'MM YY')AS forsort,sum(totalsum)AS expense from purchases GROUP BY monthly, forsort ORDER BY forsort`)
        const data = await db.query(`SELECT to_char(time, 'mon YY')AS monthly, to_char(time, 'MM YY')AS forsort,sum(totalsum)AS revenue from sales GROUP BY monthly, forsort ORDER BY forsort`)

        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows,
            "rows" : rows.rows
        }
        //   console.log(data)
        res.json(response)
    })  
 
   
    return router; 

}