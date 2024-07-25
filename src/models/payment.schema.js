const mongoose = require('mongoose')
const { paymentMethod, paymentStatus } = require('../helper/enums')

const paymentSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_user'
        },
        orderId:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_order'
        },
        paymentMethod:{
            type: String,
            enum: Object.values(paymentMethod)
        },
        transactionId: String,
        amount: Number,
        paymentStatus: {
            type: String,
            enum: Object.values(paymentStatus)
        }
    },
    {
        collection: 'tbl_payment',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
)

const PaymentSchema = mongoose.model('tbl_payment', paymentSchema)

module.exports = PaymentSchema;

