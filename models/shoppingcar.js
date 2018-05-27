const mongoose = require('mongoose');
const config = require('../config/database');
var ObjectId = require('mongodb').ObjectID;

// Car Schema
const CarSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [{
        prod_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }]
});

const ShoppingCar = module.exports = mongoose.model('ShoppingCar', CarSchema);

module.exports.checkingbyCustomerId = function(idCustomer, callback){
    const query = {user_id: idCustomer};
    ShoppingCar.findOne(query, callback);
}

module.exports.addCar = function(newCar, callback){
    newCar.save(callback);
}

module.exports.isAlreadyAdded = function(Item, callback){
    ShoppingCar.findOne(
        { $and:
            [
                { user_id: Item.idUser },
                { products: { $elemMatch: { prod_id: Item.idProd } } }
            ]
        },
        callback    
    );
}

module.exports.pushNewItem = function(Item, callback){
    let otherProduct = {
        prod_id: Item.idProd,
        qty: 1
    }
    ShoppingCar.update(
        { user_id: Item.idUser },
        { $push: { products: otherProduct } },
        callback
    );
}

// Cuento la cantidad de items del usuario que acaba de logear
module.exports.getQtyOfItems = function(idCustomer, callback){
    ShoppingCar.aggregate(
        [
            { $match: { user_id: ObjectId(idCustomer) } },
            { $project: { count: { $size: "$products" } } },
        ],
        callback
    );
}

module.exports.changeQtyOfItems = function(data, callback){
    ShoppingCar.update(
        { "_id": ObjectId(data._idCart) },
        { $set: { "products.$[elem].qty": data.qty } },
        { arrayFilters: [ { "elem.prod_id": data.prod_id } ] },
        callback
    )
}