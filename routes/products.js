var express = require('express');
var router = express.Router();
const config = require('../config/database');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find((err, products) => {
        if(err){
            res.json({success: false, msg: err});
        } else {
            res.json({success: true, products: products});
        }
    });
});

module.exports = router;