const { uploadCatImgOnCloudinary, uploadProductImgOnCloudinary } = require("../helper/cloudinary");
const { orderStatus, paymentStatus } = require("../helper/enums");
const CategorySchema = require("../models/category.schema");
const OrderSchema = require("../models/order.schema");
const PaymentSchema = require("../models/payment.schema");
const ProductSchema = require("../models/product.schema");


const addNewCategory = async(req, res) => {
    try{
        const body = req.body;

        const checkCategory = await CategorySchema.findOne({name: body.name})

        if(checkCategory){
            return res.status(400).json({status:false, message:"Category already exists"})
        }

        const localFilePath = req.file.path;

        const uploadOnCloud = await uploadCatImgOnCloudinary(localFilePath)

        const newCategory = {
            name: body.name,
            categoryImage: uploadOnCloud.url,
            description: body.description,
        }

        await CategorySchema.create(newCategory)

        res.status(201).json({status:true, message:"Category added successfully", category: newCategory})
    }catch(error){
        console.log('Internal server error while add new category: ', error);
        res.status(500).json({status:false, message:"Internal server error while add new category", error: error.message})
    }
}

const addNewProduct = async(req, res) => {
    try{
        const body = req.body;
        
        const findCategory = await CategorySchema.findOne({name:body.productCategory}).select('-__v -created_date -updated_date')
        // console.log("findCategory: ", findCategory);
        if(!findCategory){
            return res.status(404).json({status:false, message: `Product category not found`})
        }
        const uploadedImages  = req.files.map(file => file.path)

        // console.log("uploadedImages => : ",uploadedImages);

        const cloudinaryResponses = await Promise.all(uploadedImages.map(imagePath => 
            uploadProductImgOnCloudinary(imagePath , findCategory.name)
        ))

        // console.log("cloudinaryResponses=> ",cloudinaryResponses);

        const productImages = cloudinaryResponses.map(response => response.url)
        const newProduct = {
            productName: body.productName,
            description: body.description,
            price: body.price,
            stock: body.stock,
            productImages: productImages,
            productCategory: findCategory._id
        }

        await ProductSchema.create(newProduct)
        res.status(201).json({ status: true, message: "Product added successfully" });
    }catch(error){
        console.log("Internal server error while add new product: ",error);
        res.status(500).json({status:false, message: "Internal server error while add new product", error: error.message})
    }
}

const updateOrderStatus = async(req, res) => {
    try{
        const { orderId, status } = req.body;
         // Validate input
         if (!orderId || !status || !Object.values(orderStatus).includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid order ID or status" });
        }

         // Find order
        const order = await OrderSchema.findById(orderId);
        if (!order) {
            return res.status(404).json({ status: false, message: "Order not found" });
        }

        // Update order status
        order.orderStatus = status;
        await order.save();

         // If order is delivered, update payment status for COD
        if (status === orderStatus.DELIVERED) {
            const payment = await PaymentSchema.findOne({ orderId });
            if (payment && payment.paymentMethod === 'cod') {
                payment.paymentStatus = paymentStatus.COMPLETE;
                await payment.save();
            }
        }

        return res.status(200).json({ status: true, message: "Order status updated successfully", order });
    }catch(error){
        console.error("Internal server error during updating order status:", error);
        return res.status(500).json({ status: false, message: "Internal server error during updating order status", error: error.message });
    }
}

const updateOrderPaymentStatus = async(req, res) => {
    try{
        const { paymentId, status } = req.body;

        // Validate input
        if (!paymentId || !status || !Object.values(paymentStatus).includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid payment ID or status" });
        }

        // Find payment
        const payment = await PaymentSchema.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ status: false, message: "Payment not found" });
        }

        // Update payment status
        payment.paymentStatus = status;
        await payment.save();

        return res.status(200).json({ status: true, message: "Payment status updated successfully", payment });
    }catch(error){
        console.error("Internal server error during updating payment status: ", error);
        return res.status(500).json({ status: false, message: "Internal server error during updating payment status", error: error.message });
    }
}
module.exports = {
    addNewCategory,
    addNewProduct,
    updateOrderStatus,
    updateOrderPaymentStatus

}