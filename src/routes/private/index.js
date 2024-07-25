const express = require('express')

const user = require('./user')
const cart = require('./cart')
const order = require('./order')

const routes = express.Router();

routes.use('/user', user);
routes.use('/cart', cart);
routes.use('/order', order)

module.exports = routes;