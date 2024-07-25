const express = require('express');
const { route } = require('./cart');
const { placeOrder } = require('../../controllers/order.controller');

const routes = express.Router();

//New order
routes.post("/new", placeOrder);

module.exports = routes;