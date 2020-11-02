const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ObjectID } = require("mongodb"); // para validar si los IDs son mongolicos

const Product = require("../models/product");

// @route: GET /products
// @descr: Read all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// @route: POST /products
// @descr: Create a new product
router.post("/", async (req, res) => {
  try {
    // Al usar pick ya estoy validando los parametros
    const body = _.pick(req.body, ["name", "description", "price"]);
    const product = new Product(body);
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// @route: DELETE /product/:id
// @descr: Delete product by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) throw new Error("Invalid ID");
    const product = await Product.findById(id);
    if (!product) throw new Error("Product doesn't exist in the database.");
    await product.remove();
    res.send(product);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
