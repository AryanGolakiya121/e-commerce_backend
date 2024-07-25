const mongoose =  require('mongoose');
const CartSchema = require('../models/cart.schema');
const OrderSchema = require('../models/order.schema');
const { orderStatus, paymentMethod, paymentStatus } = require('../helper/enums');
const PaymentSchema = require('../models/payment.schema');
const ProductSchema = require('../models/product.schema');

const placeOrder = async(req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try{
        const userId = req.user._id;
        const { address, city, state, country, pincode, phone_number } = req.body;

        // Validate input
        if (!address || !city || !state || !country || !pincode || !phone_number) {
            return res.status(400).json({ status: false, message: "All shipping information fields are required" });
        }

        //Fetch user's cart
        const cart = await CartSchema.findOne({userId}).populate('products.productId')
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ status: false, message: "Cart is empty" });
        }

        // Calculate total price and shipping charges
        const shippingCharges = 0; // Example fixed shipping charge
        const totalPrice = cart.products.reduce((acc, product) => acc + (product.quantity * product.price), 0) + shippingCharges;

        //Create Order
        const order = new OrderSchema({
            userId,
            items:  cart.products.map(product => ({
                product_id: product.productId._id,
                quantity: product.quantity,
                shippng_charges: shippingCharges,
                total_price: product.quantity * product.price,
            })),
            shippingInfo: {
                address,
                city,
                state,
                country,
                pincode,
                phone_number
            },
            orderStatus: orderStatus.PENDING
        })
        const savedOrder = await order.save()
        // const savedOrder = await order.save({session})

        //Create Payment record
        const payment = new PaymentSchema({
            userId,
            orderId: savedOrder._id,
            paymentMethod: paymentMethod.COD,
            transactionId: null, // Since it's COD, no transaction ID
            amount: totalPrice,
            paymentStatus: paymentStatus.PENDING
        });
        await payment.save();
        // await payment.save({ session });

        //Update product stock
        for(const product of cart.products){
            const productId = product.productId._id;
            const quantity = product.quantity;

            // const productDoc = await ProductSchema.findById({productId}).session(session)
            const productDoc = await ProductSchema.findById(productId)

            if(productDoc.stock < quantity){
                await session.abortTransaction();
                return res.status(400).json({ status: false, message: `Insufficient stock for product ${productDoc.productName}` });
            }

            productDoc.stock -= quantity;
            await productDoc.save()
            // await productDoc.save({session})
        }
        // Clear user's cart
        cart.products = [];
        cart.total = 0;
        await cart.save();
        // await cart.save({ session });

        // await session.commitTransaction();
        // session.endSession();

        return res.status(201).json({
            status: true,
            message: "Order placed successfully",
            order: savedOrder,
            payment
        });
    }catch(error){
        // await session.abortTransaction();
        // session.endSession();
        console.log("Internal server error while placing order: ",error);
        return res.status(500).json({ status: false, message: "Internal server error while placing order", error: error.message });
    }
}

module.exports = {
    placeOrder
}