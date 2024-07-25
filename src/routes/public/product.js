const express = require('express');
const { getProductList, getProductListByCategory, getProductById } = require('../../controllers/product.controller');
const routes = express.Router();

routes.get('/list', getProductList);
routes.get('/category/:categoryName', getProductListByCategory);
routes.get('/show/:id', getProductById)
module.exports = routes;