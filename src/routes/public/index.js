const express = require('express');

const user = require('./auth')
const category = require('./category')
const product = require('./product')

const routes = express.Router();

routes.use('/auth', user);
routes.use('/category', category);
routes.use('/product', product);

module.exports = routes;