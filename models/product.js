const mongoose = require('mongoose');
const config = require('../config/database');

// Product Schema
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);

// ESTAS FUNCIONES LAS COMENTE PQ SON INNECESARIAS
// PUEDEN SER USADAS LAS DE MONGO DIRECTAMENTE

// module.exports.getProducts = function(callback){
//     Product.find(callback);
// }

// module.exports.getProductByID = function(idProd, callback){
//     const query = { _id: idProd };
//     Product.findOne(query, callback);
// }