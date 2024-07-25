const express = require('express');
const { getCategoryList } = require('../../controllers/category.controller');
const routes = express.Router();

routes.get('/list', getCategoryList)

module.exports = routes;