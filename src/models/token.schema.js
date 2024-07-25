const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const tokenSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.ObjectId,
            ref:"tbl_user"
        },
        token:{
            type: String,
            required: true
        }
    },
    {
        collection: 'tbl_token',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }
    }
)

const TokenSchema = mongoose.model('tbl_token', tokenSchema)

module.exports = TokenSchema;