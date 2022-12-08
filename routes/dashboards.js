const express = require('express');
const { isAdmin } = require('../helpers/util')

const router = express.Router();
const currencyFormatter = require('currency-formatter');//ini manggil functions curencyFormatter

let data_exporter = require('json2csv').Parser;



module.exports = (db) => {
    router.get('/', isAdmin, async (req, res, next) => {
        try {
            //card expense, revenue, earning and total transactions
            const report = await db.query(`SELECT (SELECT SUM(totalsum) FROM purchases) AS purchases,(SELECT SUM(totalsum) FROM sales) AS sales`)
            const { rows: salesTotal } = await db.query('SELECT COUNT(*) AS total FROM sales')
            const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases GROUP BY monthly, forsort ORDER BY forsort")
            const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales GROUP BY monthly, forsort ORDER BY forsort")

            let getMonth = []
            for (let i = 0; i < totalpurchase.length; i++) {
                getMonth.push(totalpurchase[i].monthly)
            }

            let data = totalpurchase.concat(totalsales)
            let newData = {}
            let income = []

            data.forEach(item => {
                if (newData[item.forsort]) {
                    newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                } else {
                    newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                }
            });
            for (const key in newData) {
                income.push(newData[key])
            }

            res.render('dashboards/index', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'POS - Data Reports',
                user: req.session.user,
                report,
                currencyFormatter,
                salesTotal,
                query: req.query,
                data: income
            })
        } catch (e) {
            res.send(e);
        }
    });

    router.get('/chart', isAdmin, async (req, res, next) => {
        try {
            const { startdate, enddate } = req.query
            if (startdate != '' && enddate != '') {
                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1 AND time BETWEEN $1 AND $2", [startdate, enddate])
                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1 AND time BETWEEN $1 AND $2", [startdate, enddate])
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases WHERE time BETWEEN $1 AND $2 GROUP BY monthly, forsort ORDER BY forsort", [startdate, enddate])
                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales WHERE time BETWEEN $1 AND $2 GROUP BY monthly, forsort ORDER BY forsort", [startdate, enddate])
                let getMonth = []

                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }
                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []
                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });
                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }

                res.json({ direct, member, getMonth, income })
            } else if (startdate) {
                const { startdate } = req.query
                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1 AND time >= $1", [startdate])
                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1 AND time >= $1", [startdate])
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases WHERE time >= $1 GROUP BY monthly, forsort ORDER BY forsort", [startdate])
                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales WHERE time >= $1 GROUP BY monthly, forsort ORDER BY forsort", [startdate])

                let getMonth = []
                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }

                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []

                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });

                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }
                res.json({ direct, member, getMonth, income })
            } else if (enddate) {
                const { enddate } = req.query
                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1 AND time <= $1", [enddate])
                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1 AND time <= $1", [enddate])
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases WHERE time <= $1 GROUP BY monthly, forsort ORDER BY forsort", [enddate])
                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales WHERE time <= $1 GROUP BY monthly, forsort ORDER BY forsort", [enddate])

                let getMonth = []
                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }
                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []

                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });

                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }
                res.json({ direct, member, getMonth, income })
            } else {

                const { rows: direct } = await db.query("SELECT COUNT(*) FROM sales WHERE customer = 1 ")
                const { rows: member } = await db.query("SELECT COUNT(*) FROM sales WHERE customer != 1 ")
                const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases GROUP BY monthly, forsort ORDER BY forsort")
                const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales GROUP BY monthly, forsort ORDER BY forsort")

                let getMonth = []

                for (let i = 0; i < totalpurchase.length; i++) {
                    getMonth.push(totalpurchase[i].monthly)
                }

                let data = totalpurchase.concat(totalsales)
                let newData = {}
                let income = []

                data.forEach(item => {
                    if (newData[item.forsort]) {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
                    } else {
                        newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
                    }
                });

                for (const key in newData) {
                    income.push(Number(newData[key].revenue - newData[key].expense))
                }
                res.json({ direct, member, getMonth, income })
            }
        } catch (error) {
            // res(error, 'im sorry,, please tell the developer about this error')
            res.send(error);
        }
    });
    // router.get('/export', isAdmin, async (req, res, next) => {
    //     try {
    //         const { rows: totalpurchase } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalpurchases FROM purchases GROUP BY monthly, forsort ORDER BY forsort")
    //         const { rows: totalsales } = await db.query("SELECT to_char(time, 'Mon YY') AS monthly, to_char(time, 'YYMM') AS forsort, sum(totalsum) AS totalsales FROM sales GROUP BY monthly, forsort ORDER BY forsort")

    //         let getMonth = []
    //         for (let i = 0; i < totalpurchase.length; i++) {
    //             getMonth.push(totalpurchase[i].monthly)
    //         }

    //         let data = totalpurchase.concat(totalsales)
    //         let newData = {}
    //         let earning = []
    //         let income = []
    //         let values = []
    //         data.forEach(item => {
    //             if (newData[item.forsort]) {
    //                 newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : newData[item.forsort].expense, revenue: item.totalsales ? item.totalsales : newData[item.forsort].revenue }
    //             } else {
    //                 newData[item.forsort] = { monthly: item.monthly, expense: item.totalpurchases ? item.totalpurchases : 0, revenue: item.totalsales ? item.totalsales : 0 }
    //             }
    //         });
    //         for (const key in newData) {
    //             income.push(newData[key])    
    //         }
    //         let params = []
    //         for (const key in newData) {
    //             earning.push(Number(newData[key].revenue - newData[key].expense)) 
    //             }
    //             for (const key in earning) {
    //                 income.push(earning[key])    
    //             }
    //             console.log(income,typeof(values))  



    //         let dataFile = JSON.parse(JSON.stringify(income))
    //         let file_header = ['Monthly', 'Expense', 'Revenue', 'Earning']
    //         let json_data = new data_exporter({ file_header })
    //         let csv_data = json_data.parse(dataFile)
    //         res.setHeader("Content-Type", "text/csv")
    //         res.setHeader("Content-Disposition", "attachment; filename=Report.csv");

    //         res.send(csv_data)
    //     } catch (error) {
    //         res.send(error);
    //     }
    // });

    return router;

}