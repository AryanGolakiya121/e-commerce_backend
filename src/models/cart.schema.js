const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: "tbl_user"
        },
        products:[
            {
                productId:{
                    type: mongoose.Schema.ObjectId,
                    ref: 'tbl_product'
                },
                name: String,
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity can not be less then 1.'],
                    default: 1
                },
                price: Number
            }
        ],
        total:{
            type: Number,
        }
    },
    {
        collection: 'tbl_cart',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
)
const CartSchema = mongoose.model('tbl_cart', cartSchema)
module.exports = CartSchema;