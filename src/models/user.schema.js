const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        confirmPassword: String,
        phoneNumber: String,
        isAdmin: Boolean,
        profileImage: String,
        address: String,
        city: String,
        state: String,
        cuntry: String,
        pincode: String,
        googleId: String,
        isVerified: Boolean,
        registrationDate :{
            type: Date,
        },
        orderHistory:[{
            type: [mongoose.Schema.ObjectId],
            ref: 'tbl_order'
        }],
        last_login: Date,
    },
    {
        collection:'tbl_user',
        timestamps:{
            createdAt: 'created_date',
            updatedAt: 'updated_date'
        }

    }
)

const UserSchema = mongoose.model('tbl_user',userSchema)

module.exports = UserSchema;