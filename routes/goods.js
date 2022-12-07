const express = require('express');
const path = require('path')
const { isAdmin } = require('../helpers/util')
// const { currencyFormatter } = require('../helpers/util')
const router = express.Router();



module.exports = (db) => {
    router.get('/', isAdmin, async (req, res, next) => {
        try { 
            const {rows: stock } = await db.query('SELECT barcode, name, stock FROM goods where stock <20')
        const {rows: counter } = await db.query('SELECT count(*) FROM goods where stock <20')
            res.render('goods/list', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'Goods Utilities',
                user: req.session.user,
                stock,
                counter 
            })
        } catch (e) {
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

    router.get('/add', isAdmin, async (req, res, next) => {
        try {
            const { rows: units } = await db.query('SELECT * FROM units') // untuk column units
            res.render('goods/add', {
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
  router.post('/add', isAdmin, async (req, res, next) => {
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
            sampleFile.mv(uploadPath)

            const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body
            const { rows: goods } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
            if (goods.length > 0) {
                req.flash('error', 'Product already exist!')
                return res.redirect('/goods')
            }
            await db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, imagesfiles])
            req.flash('success', 'Product created successfully')
            res.redirect('/goods')
        } catch (error) {
            res.send(error)
        }
    })
    router.get('/edit/:barcode', isAdmin, async (req, res, next) => {
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

    router.post('/edit/:barcode', isAdmin, async (req, res, next) => {
        try {
            let sampleFile;
            let uploadPath;
        
            const { barcode } = req.params
            const { name, stock, purchaseprice, sellingprice, unit } = req.body
            
            if (!req.files || Object.keys(req.files).length === 0) {
                await db.query('UPDATE goods SET name=$1, stock=$2, purchaseprice=$3, sellingprice=$4, unit=$5 WHERE barcode=$6',
                [name, stock, purchaseprice, sellingprice, unit, barcode])
            } else {
                // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
                sampleFile = req.files.sampleFile;
                const imagesfiles = `${Date.now()}-${sampleFile.name}`
                uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', imagesfiles);
                sampleFile.mv(uploadPath)

                const { barcode } = req.params
                const { name, stock, purchaseprice, sellingprice, unit } = req.body
                await db.query('UPDATE goods SET name=$1, stock=$2, purchaseprice=$3, sellingprice=$4, unit=$5, picture=$6 WHERE barcode=$7', 
                [name, stock, purchaseprice, sellingprice, unit, imagesfiles, barcode])
            }
            req.flash('success', 'Product edited successfully')
            res.redirect('/goods')
        } catch (err) { 
            res.send(err) 
        }
    })

    router.get('/delete/:barcode', isAdmin, async (req, res, next) => {
        try {
            const { barcode } = req.params
            await db.query('DELETE FROM goods WHERE barcode = $1', [barcode])
            req.flash('success', 'Product deleted successfully')
            res.redirect('/goods');
        } catch (err) {
            res.send(err)
        }
    });
    return router;

}