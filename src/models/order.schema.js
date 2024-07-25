const mongoose = require('mongoose')
const { orderStatus } = require('../helper/enums')

const orderSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_user'
        },
        items:[
            {
                product_id:{
                    type: mongoose.Schema.ObjectId,
                    ref: 'tbl_product'
                },
                quantity: Number,
                shippng_charges: Number,
                total_price: Number,
            }
        ],
        shippingInfo:[
            {
                address: String,
                city: String,
                state: String,
                country: String,
                pincode: String,
                phone_number: Number
            }
        ],
        orderStatus:{
            type: String,
            enum: Object.values(orderStatus)
        },
        orderDate: Date,
    },
    {
        collection: 'tbl_order',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
);

const OrderSchema = mongoose.model("tbl_order", orderSchema);

module.exports = OrderSchema;