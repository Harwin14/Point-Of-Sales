const express = require('express');
const path = require('path')
const { isLoggedIn } = require('../helpers/util')
// const { currencyFormatter } = require('../helpers/util')
const router = express.Router();
var currencyFormatter = require('currency-formatter');


module.exports = (db) => {

    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: goods } = await db.query('SELECT * FROM goods',)
            //console.log(goods)
            res.render('goods/list', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'Goods Utilities',
                user: req.session.user,
                currencyFormatter,
                goods
            })
        } catch (e) {
            console.log(e)
            res.send(e);
        }
    });


    router.get('/datatable', async (req, res) => {
        let params = []

        if (req.query.search.value) {
            params.push(`barcode ilike '%${req.query.search.value}%'`)
        }
        if (req.query.search.value) {
            params.push(`name ilike '%${req.query.search.value}%'`)
        }
       
       
        console.log(req.query.length)
        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir

        const total = await db.query(`select count(*) as total from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''}`)
        const data = await db.query(`select * from goods${params.length > 0 ? ` where ${params.join(' or ')}` : ''} order by ${sortBy} ${sortMode} limit ${limit} offset ${offset} `)
        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }
        res.json(response)
    })

    router.get('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: units } = await db.query('SELECT * FROM units') // untuk column units
            res.render('goods/add', {
                currentPage: 'Goods Utilities',
                user: req.session.user,
                units
            })
        } catch (e) {
            res.send(e);
        }
    });



    // router.post('/add', isLoggedIn, (req, res) => {
    //     let sampleFile;
    //     let uploadPath;

    //     if (!req.files || Object.keys(req.files).length === 0) {
    //         return res.status(400).send('No files were uploaded.');
    //     }

    //     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //     sampleFile = req.files.sampleFile;
    //     const imagesfiles = `${Date.now()}-${sampleFile.name}`
    //     uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagesfiles);

    //     // Use the mv() method to place the file somewhere on your server
    //     sampleFile.mv(uploadPath, function (err) {
    //         if (err)
    //             return res.status(500).send(err);

    //         const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body
    //         console.log(barcode, name, stock, purchaseprice, sellingprice)

    //         db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, imagesfiles])
    //         if (err) { console.log(err)
    //             return console.error(err.message);
    //         }
    //         res.redirect('/goods')
    //     })

    // });
    router.get('/add', isLoggedIn, async (req, res, next) => {
        const data = await db.query('SELECT * FROM goods')

        res.render('goods/add', { user: req.session.user, data: data.rows });
    });

    router.post('/add', isLoggedIn, async (req, res, next) => {
        try {
            let sampleFile;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            sampleFile = req.files.sampleFile;
            const imagefiles = `${Date.now()}-${sampleFile.name}`
            uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagefiles);

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(uploadPath)

            const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body
            const { rows: goods } = await db.query('SELECT * FROM goods" WHERE barcode = $1', [barcode])
            if (goods.length > 0) {
                req.flash('error', 'Product already exist!')
                return res.redirect('/add')
            }

            await db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, imagefiles])

            res.redirect('/goods')
        } catch (error) {
            res.send(error)
        }
    })
    router.get('/edit/:barcode', isLoggedIn, async (req, res, next) => {
        try {

            const { barcode } = req.params
            const { rows } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
            const { rows: units } = await db.query('SELECT * FROM units',)
            res.render('goods/edit', {
                currentPage: 'Goods Utilities',
                user: req.session.user,
                goods: rows[0],
                units
            })

        } catch (e) {
            res.send(e);
        }
    });

    router.post('/edit/:barcode', isLoggedIn, async (req, res, next) => {
        try {
            let sampleFile;
            let uploadPath;

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }

            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            sampleFile = req.files.sampleFile;
            const imagesfiles = `${Date.now()}-${sampleFile.name}`
            uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagesfiles);

            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);

                const { barcode } = req.params
                const { name, stock, purchaseprice, sellingprice, unit } = req.body
                db.query('UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7', [name, stock, purchaseprice, sellingprice, unit, imagesfiles, barcode])
                if (err) {
                    console.log(err)
                    return console.error(err.message);
                }
                res.redirect('/goods')
            })
        } catch (err) {
            console.log(err)
        }
    })
    // router.post('/edit/:barcode', isLoggedIn, async (req, res) => {
    //     let sampleFile;
    //     let uploadPath;

    //     if (!req.files || Object.keys(req.files).length === 0) {
    //         return res.status(400).send('No files were uploaded.');
    //     }

    //     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //     sampleFile = req.files.sampleFile;
    //     const imagesfiles = `${Date.now()}-${sampleFile.name}`
    //     uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagesfiles);

    //     // Use the mv() method to place the file somewhere on your server
    //     sampleFile.mv(uploadPath, function (err) {
    //         if (err)
    //             return res.status(500).send(err);

    //         const { barcode } = req.params
    //         const { name, stock, purchaseprice, sellingprice, unit } = req.body
    //         db.query('UPDATE goods SET name = $1, stock = $2, purchaseprice = $3, sellingprice = $4, unit = $5, picture = $6 WHERE barcode = $7', [name, stock, purchaseprice, sellingprice, unit, imagesfiles, barcode])
    //         if (err) { console.log(err)
    //             return console.error(err.message);
    //         }
    //         res.redirect('/goods')
    //     })
    // })

    router.get('/delete/:barcode', isLoggedIn, async (req, res, next) => {
        try {
            await db.query('DELETE FROM goods WHERE barcode = $1', [req.params.barcode])

            res.redirect('/goods');
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    });
    return router;

}