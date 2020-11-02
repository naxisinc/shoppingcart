const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectID;

// Cart Schema
const CartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  products: [
    {
      prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
});

const ShoppingCart = (module.exports = mongoose.model(
  "ShoppingCart",
  CartSchema
));

module.exports.checkingbyCustomerId = function (idCustomer, callback) {
  const query = { user_id: idCustomer };
  ShoppingCart.findOne(query, callback);
};

module.exports.addCart = function (newCart, callback) {
  newCart.save(callback);
};

module.exports.isAlreadyAdded = function (Item, callback) {
  ShoppingCart.findOne(
    {
      $and: [
        { user_id: Item.idUser },
        { products: { $elemMatch: { prod_id: Item.idProd } } },
      ],
    },
    callback
  );
};

module.exports.pushNewItem = function (Item, callback) {
  let otherProduct = {
    prod_id: Item.idProd,
    qty: 1,
  };
  ShoppingCart.update(
    { user_id: Item.idUser },
    { $push: { products: otherProduct } },
    callback
  );
};

// Cuento la cantidad de items del usuario que acaba de logear
module.exports.getQtyOfItems = function (idCustomer, callback) {
  ShoppingCart.aggregate(
    [
      { $match: { user_id: ObjectId(idCustomer) } },
      { $project: { count: { $size: "$products" } } },
    ],
    callback
  );
};

module.exports.changeQtyOfItems = function (data, callback) {
  ShoppingCart.update(
    { _id: ObjectId(data._idCart) },
    { $set: { "products.$[elem].qty": data.qty } },
    { arrayFilters: [{ "elem.prod_id": data.prod_id }] },
    callback
  );
};
