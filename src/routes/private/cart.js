const express = require('express');
const { addProductToCart, getCartProduct, deleteProductFromCart, updateProductQuantityInCart } = require('../../controllers/cart.controller');

const routes = express.Router();

//Add product to cart
routes.post("/product/add", addProductToCart);

//Get prouct list from cart
routes.get("/products", getCartProduct)

//Update product quantity in cart
routes.put("/product/update/quantity", updateProductQuantityInCart)

//Delete product from cart using productId
routes.delete("/product/delete/:productId", deleteProductFromCart)

module.exports = routes;