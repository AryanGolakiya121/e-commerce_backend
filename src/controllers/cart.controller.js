const CartSchema = require("../models/cart.schema");
const ProductSchema = require("../models/product.schema");


const addProductToCart = async(req, res, next) => {
    try{
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if(!productId || !quantity){
            return res.status(401).json({status:false, message: "Please provide productId or quantity to add product in cart"})
        }

        if (quantity <= 0) {
            return res.status(400).json({ status: false, message: "Quantity must be a positive number" });
        }

        let cart = await CartSchema.findOne({userId})


        const product = await ProductSchema.findById(productId)

        if(!product){
            return res.status(404).json({status:false, message: "Product not found"})
        }

        // const price = product.price;
        // const name = product.productName;
        const { price, productName: name } = product;

        if(cart){
            // if cart exists for the user
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

            // Check if product exists or not
            if(itemIndex > -1){
                // const productItem = cart.products[itemIndex];
                // productItem.quantity += quantity;
                cart.products[itemIndex].quantity  += quantity;
            } else {
                cart.products.push({productId, name, quantity, price})
            }

            //update cart total
            cart.total = cart.products.reduce((acc, product) => acc + (product.quantity * product.price), 0)
            // cart.total += quantity * price;

            cart = await cart.save();
            // await cart.save()
            // return res.status(201).json({status: true,message: "Product added to cart successfully", cart});

        } else {
            // no cart exists, create one
            const newCart = {
                userId: userId,
                products:[{ productId, name, quantity, price}],
                total: quantity * price
            }
            cart = await CartSchema.create(newCart)
        }
        return res.status(201).json({status: true,message: "Product added to cart successfully",});
        // return res.status(201).json({status: true,message: "Product added to cart successfully", cart});

    }catch(error){
        console.log("Internal server error while add product to cart: ", error);
        res.status(500).json({status: false, message: "Internal server error while add product to cart", error: error.message})
    }
}

const updateProductQuantityInCart= async(req, res) => {
    try{
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ status: false, message: "Product ID and quantity are required" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ status: false, message: "Quantity must be a positive number" });
        }

        let cart = await CartSchema.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ status: false, message: "Cart not found" });
        }

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());
        if (itemIndex === -1) {
            return res.status(404).json({ status: false, message: "Product not found in cart" });
        }

        cart.products[itemIndex].quantity = quantity;
        cart.total = cart.products.reduce((acc, product) => acc + (product.quantity * product.price), 0);
        await cart.save();

        return res.status(200).json({ status: true, message: "Product quantity updated successfully" });
    }catch(error){
        console.error("Internal server error while updating product quantity: ", error);
        return res.status(500).json({ status: false, message: "Internal server error updating product quantity:", error: error.message });
    }
}

const getCartProduct = async(req, res) => {
    try{
        const userId = req.user._id;

        const cart = await CartSchema.findOne({userId: userId})

        if(!cart){
            return res.status(404).json({status:false, message: "Your cart is empty"})
        }

        res.status(200).json({status: true, message: "Successfully fetch cart data", cart})

    }catch(error){
        console.log("Internal server error while fetching cart data: ",error);
        res.status(500).json({status: false, message: "Internal server error while fetching cart data", error: error.message})
    }
}

const deleteProductFromCart = async(req, res) => {
    try{
        const userId = req.user._id;
        const productId = req.params.productId;

        let cart = await CartSchema.findOne({userId});
        if (!cart) {
            return res.status(404).json({ status: false, message: "Cart not found" });
        }
        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());

        if (itemIndex === -1) {
            return res.status(404).json({ status: false, message: "Product not found in cart" });
        }

        // if(itemIndex > -1){
        //     const productItem = cart.products[itemIndex];
        //     cart.total -= productItem.quantity * productItem.price;
        //     cart.products.splice(itemIndex, 1)
        // }

        cart.products.splice(itemIndex, 1)
        cart.total = cart.products.reduce((acc, product) => acc + (product.quantity * product.price), 0);
        await cart.save();

        res.status(201).json({status: true, message: 'Product deleted from cart successfully',})
    }catch(error){
        console.log("Internal server error while deleting product from cart: ",error);
        res.status(500).json({status: false, message: "Internal server error while deleting product from cart", error: error.message})
    }
}

module.exports = {
    addProductToCart,
    updateProductQuantityInCart,
    getCartProduct,
    deleteProductFromCart,
}