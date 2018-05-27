const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var ObjectId = require('mongodb').ObjectID;

// User Schema
// Aqui se define el objeto q sera el usado en las queries
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  buildingAddress: {
    street: { type: String },
    apt: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: Number }
  },
  shippingAddress: [{
    street: String,
    apt: String,
    city: String,
    state: String,
    zip: Number,
    default: Boolean
  }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.clearDefaultAddress = function (data, callback) {
  if(data.isDefault) {
    User.update(
      { "_id": ObjectId(data.userID) },
      { $set: { "shippingAddress.$[elem].default": false } },
      { arrayFilters: [ { "elem.default": true } ] },
      callback
    )
  }
  else {  // ese else vale oro 
    return callback(null);
  }
}

module.exports.addShippingAddress = function (data, callback) {
  let newAddress = {
    street: data.street,
    apt: data.apt,
    city: data.city,
    state: data.state,
    zip: data.zipcode,
    default: data.default
  }

  User.update(
    { "_id": ObjectId(data.userID) },
    { $push: { shippingAddress: newAddress } },
    callback
  )
}

module.exports.delShippingAddress = function(data, callback) {
  User.update(
      { _id: data.idUser},
      { $pull: { shippingAddress: { _id: data.idShippingAddress } } },
      callback
  )
}

