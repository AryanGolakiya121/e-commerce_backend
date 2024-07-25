const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        productName: String,
        description: String,
        price: Number,
        stock: Number,
        productImages: [String],
        productCategory:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_category'
        },
        
    },
    {
        collection: 'tbl_product',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
)

const ProductSchema = mongoose.model('tbl_product', productSchema);
module.exports = ProductSchema;