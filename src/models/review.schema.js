const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_user'
        },
        productId:{
            type: mongoose.Schema.ObjectId,
            ref: 'tbl_product'
        },
        rating: Number,
        message: String
    },
    {
        collection: 'tbl_review',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
);

const ReviewSchema = mongoose.model('tbl_review', reviewSchema);

module.exports = ReviewSchema;