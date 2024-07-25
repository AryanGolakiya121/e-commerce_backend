const express = require('express');
const { uploadCategoryImage } = require('../../middleware/uploadCategoryImage');
const { addNewCategory } = require('../../controllers/admin.controller');
const routes = express.Router();


routes.post('/add',uploadCategoryImage, addNewCategory);


module.exports = routes;