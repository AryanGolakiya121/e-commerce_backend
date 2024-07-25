const express = require('express');
const category = require('./category');
const product = require('./product');
const { adminAuth } = require('../../middleware/auth');


const routes = express.Router();

// routes.all("/api/admin", adminAuth);

routes.use('/category', category);
routes.use('/product', product);

module.exports = routes;