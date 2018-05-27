const mongoose = require('mongoose');
const config = require('../config/database');

// Payment Schema
const PaymentSchema = mongoose.Schema({
    id: { type: String, required: true },
    intent: { type: String, required: true },
    state: { type: String, required: true },
    cart: { type: String, required: true },
    payer: {
        payment_method: { type: String, required: true },
        status: { type: String, required: true },
        payer_info: {
            email: { type: String, required: true },
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            payer_id: { type: String, required: true },
            shipping_address: {
                recipient_name: { type: String, required: true },
                line1: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                postal_code: { type: String, required: true },
                country_code: { type: String, required: true },
            },
            country_code: { type: String, required: true },
        }
    },
    transactions: [{
        amount: {
            total: { type: String, required: true },
            currency: { type: String, required: true },
            details: {} //este no lo toque
        },
        payee: {
            merchant_id: { type: String, required: true },
            email: { type: String, required: true },
        },
        description: { type: String, required: true },
        item_list: {
            items: [{
                name: { type: String, required: true },
                sku: { type: String, required: true },
                price: { type: String, required: true },
                currency: { type: String, required: true },
                quantity: { type: String, required: true },
            }],
            shipping_address: {
                recipient_name: { type: String, required: true },
                line1: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                postal_code: { type: String, required: true },
                country_code: { type: String, required: true },
            }
        },
        related_resources: [{
            sale: {
                id: { type: String, required: true },
                state: { type: String, required: true },
                amount: {
                    total: { type: String, required: true },
                    currency: { type: String, required: true },
                    details: {
                        subtotal: { type: String, required: true },
                    }
                },
                payment_mode: { type: String, required: true },
                protection_eligibility: { type: String, required: true },
                protection_eligibility_type: { type: String, required: true },
                transaction_fee: {
                    value: { type: String, required: true },
                    currency: { type: String, required: true },
                },
                parent_payment: { type: String, required: true },
                create_time: { type: String, required: true },
                update_time: { type: String, required: true },
                links: [{
                    href: { type: String, required: true },
                    rel: { type: String, required: true },
                    method: { type: String, required: true },
                }]
            }
        }]
    }],
    create_time: { type: String, required: true },
    links: [{
        href: { type: String, required: true },
        rel: { type: String, required: true },
        method: { type: String, required: true },
    }],
    httpStatusCode: { type: String, required: true }
})

const Payment = module.exports = mongoose.model('Payment', PaymentSchema);

module.exports.addPayment = function (payment, callback) {
    payment.save(callback)
}