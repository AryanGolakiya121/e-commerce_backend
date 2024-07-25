const {Segments, Joi, celebrate } = require('celebrate')

module.exports = {
    registerValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).message('Contact number nust be a 10-digits number').required(),
            isAdmin: Joi.boolean().default(false),
            profileImage: Joi.string().allow(null, ""),
            address: Joi.string().allow(null),
            city: Joi.string().allow(null),
            state: Joi.string().allow(null, ""),
            country: Joi.string().allow(null, ""),
            pincode: Joi.string().allow(null,""),
            googleId: Joi.string().allow(null, ""),
            isVerified: Joi.boolean().default(false),
            registrationDate: Joi.date().default(Date.now()),
            orderHistory: Joi.array()
        })
    }),
    loginValidator: () => celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
    })
}