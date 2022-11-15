const { isLoggedIn } = require('../helpers/util')
const express = require('express');
const path = require('path')
const router = express.Router();


module.exports = (db) => {
    router.get('/', isLoggedIn, async (req, res, next) => {
        try {
            
            const { rows: goods } = await db.query('SELECT goods.barcode, goods.name, goods.stock, goods.purchaseprice, goods.sellingprice, units.unit, goods.picture  FROM goods LEFT JOIN units ON goods.unit = units.unit', )
            res.render('goods/list', {
                success: req.flash('success'),
                error: req.flash('error'),
                currentPage: 'Goods Utilities',
                user: req.session.user,
                goods
            })
        } catch (e) {
            console.log(e)
            res.send(e);
        }
    });
    router.get('/add', isLoggedIn, async (req, res, next) => {
        try {
            const { rows: units } = await db.query('SELECT * FROM units')
            res.render('goods/add', {
                currentPage: 'Goods Utilities',
                user: req.session.user,
                units
            })
        } catch (e) {
            res.send(e);
        }
    });
    router.post('/add', isLoggedIn, (req, res) => {
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

            const { barcode, name, stock, purchaseprice, sellingprice, unit } = req.body
            console.log(barcode, name, stock, purchaseprice, sellingprice)


            db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, unit, picture) VALUES ($1, $2, $3, $4, $5, $6, $7)', [barcode, name, stock, purchaseprice, sellingprice, unit, imagesfiles])
            if (err) {
                return console.error(err.message);
            }
            res.redirect('/goods')
        })

    });
    router.get('/edit/:barcode', isLoggedIn, async (req, res, next) => {
        try {
          const { barcode } = req.params
          const { rows } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
          res.render('goods/edit', {
            currentPage: 'Goods Utilities',
            user: req.session.user,
            goods: rows[0]
          })
        } catch (e) {
          res.send(e);
        }
      });
    //     const { barcode, name, stock, purchaseprice, sellingprice } = req.body
    //     console.log(barcode, name, stock, purchaseprice, sellingprice, picture)
    //     const { rows: goods } = await db.query('SELECT * FROM goods WHERE barcode = $1', [barcode])
    //     if (goods.length > 0) {
    //         throw 'Goods already exist'
    //     }

    //     await db.query('INSERT INTO goods (barcode, name, stock, purchaseprice, sellingprice, picture) VALUES ($1, $2, $3, $4, $5, $6)', [barcode, name, stock, purchaseprice, sellingprice, imagesfiles])
    //     req.flash('success', 'Goods created successfully')
    //     res.redirect('/goods')
    // } catch (err) {
    //     req.flash('error', err)
    //     return res.redirect('/goods')
    // }




    // })

    router.post('/upload', function (req, res) {
        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.sampleFile;
        uploadPath = path.join(__dirname, '..', 'public', 'images', 'upload', `${Date.now()}-${sampleFile.name}`);

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded!');
        });
    });
    return router;

}