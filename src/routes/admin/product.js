const express = require('express');
const { addNewProduct } = require('../../controllers/admin.controller');
const { uploadProductImages } = require('../../middleware/uploadProductImages');


const routes = express.Router();

routes.post('/add', uploadProductImages, addNewProduct)

module.exports = routes;