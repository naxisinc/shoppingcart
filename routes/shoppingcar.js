const express = require('express')
const router = express.Router()
const config = require('../config/database')
const User = require('../models/user')
const Product = require('../models/product')
const ShoppingCar = require('../models/shoppingcar')
const Payment = require('../models/payment')
const paypal = require('paypal-rest-sdk');
const ObjectId = require('mongodb').ObjectID    // esto esta por estudiar si se queda o se va

paypal.configure({
    'mode': 'sandbox',
    'client_id':     'AWM6-n9QGgqGZmbVEuVCt3qtHaqaADzE2dXuKY_07WY7aqRPG7q6DBoGnDOuMznT4rBuLQz-Lp3rcUUX',
    'client_secret': 'EK36KJV_hvsOP6RfQcVhI8vmcXvezkrHWzA3e5qmzZDPcVovfB36qxwnwgF635uLVTOUq9-tS8dncm3J'
});

// Global variable amount para poder transmitirle el monto a paypal.execute
const amount = 0;

router.get('/:userID', async(req, res, next) => {
    try {
        let cart = await ShoppingCar.findOne({ user_id: req.params.userID }).lean() //lean me permite escibir el object
        
        if(!cart || (cart.products === undefined || cart.products.length == 0)) {
            return res.json({ isEmpty: true, msg: "The cart is empty" })
        }
        // console.log(cart)
        
        let index = 0
        for(const product of cart.products) {
            
            // AMBAS HACEN LO MISMO
            // let details = await Product.findOne({ _id: product.prod_id }, { _id: 0 })
            let details = await Product.findById(product.prod_id, '-_id')
            
            if(!details) {
                return res.json({ isEmpty: true, msg: "The details of the products could not be obtained" })
            }
            
            // console.log(details)

            // pushing the details inside the products
            cart.products[index].name = details.name
            cart.products[index].description = details.description
            cart.products[index++].price = details.price
        }
        
        return res.json({ isEmpty: false, cart})
        
    } catch (err) {
        console.log(err)
        next()
    }
})

router.post('/change-qty', async(req, res, next) => {
    try {
        let updated = await ShoppingCar.update(
            { _id: ObjectId(req.body._idCart) },
            { $set: { "products.$[elem].qty": req.body.qty } },
            { arrayFilters: [ { "elem._id": ObjectId(req.body._idProd) } ] }
        )

        if(!updated) return next() // something is wrong

        return res.json({ success: true })

    } catch (err) {
        console.log(err)
        next()
    }
})

router.post('/my-items', (req, res, next) => {
    var idUser = req.body.id
    ShoppingCar.getQtyOfItems(idUser, (err, doc) => {
        if (err) {
            return res.json({ success: false, msg: err })
        }
        if (doc && doc[0] != undefined) {
            return res.json({ success: true, qty: doc[0].count })
        } else {
            return res.json({ success: true, qty: 0 })
        }
    })
})

router.post('/addcart', (req, res, next) => {

    var Item = req.body

    ShoppingCar.checkingbyCustomerId(Item.idUser, (err, car) => {   // pregunto si el user tiene carro
        if (err) throw err
        if (!car) { // este user no tiene carro
            let newCart = new ShoppingCar({
                user_id: Item.idUser,
                products: [{
                    prod_id: Item.idProd,
                    qty: 1
                }]
            })
            ShoppingCar.addCar(newCart, (err, car) => {
                if (err) throw err
                return res.json({ success: true, msg: 'Item added successfully' })
            })
        } else { // si ya tiene carro
            ShoppingCar.isAlreadyAdded(Item, (err, doc) => {
                if (err) throw err
                if (!doc) { // el item es nuevo en el carro
                    ShoppingCar.pushNewItem(Item, (err, doc) => {
                        if (err) throw err
                        return res.json({ success: true, msg: 'pushed successfully' })
                    })
                } else { // el item ya existe en el carro
                    return res.json({ success: false, msg: 'the item is already added' })
                }
            })
        }
    })
})

router.delete('/:idCart/:idProd', async(req, res, next) => {
    try {
        let prod = await ShoppingCar.update({ _id: req.params.idCart },
            { $pull: { products: { _id: req.params.idProd } } })

        if(!prod) return next()  // something is wrong

        return res.json({ success: true })

    } catch (err) {
        console.log(err)
        next()
    }
})

router.post('/pay', (req, res, next) => {
    // console.log(req.body)
    this.amount = req.body.amountPrice

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/cart/success",
            "cancel_url": "http://localhost:3000/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": req.body.products,
                "shipping_address": req.body.shipping_address
            },
            "amount": {
                "currency": "USD",
                "total": req.body.amountPrice,   //este TIENE q ser la sumatoria exacta de los items
            },
            "description": "This is the payment description."
        }]
    }
    
    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            throw error;
        } else {
            for(let i=0; i<payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                   return res.json({ success: true, url: payment.links[i].href })
                }
            }
        }
    })
})

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId

    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": this.amount
            }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            let newPay = new Payment(payment)
            Payment.addPayment(newPay, (err) => {
                if(err) {
                    res.send('Failed to register the payment')
                } else {
                    res.send('Payment registered')
                }
            });
        }
    })
})

router.get('/cancel', (req, res) => res.send('Cancelled'))

module.exports = router