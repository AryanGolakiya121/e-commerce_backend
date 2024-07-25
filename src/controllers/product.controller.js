const CategorySchema = require("../models/category.schema");
const ProductSchema = require("../models/product.schema")


const getProductList = async(req, res) => {
    try{
        // const findCategory = await .find().select('-__v -updated_date -created_date')

        const findProduct = await ProductSchema.find().populate("productCategory", "name").select('-__v -created_date -updated_date')
        if(!findProduct || findProduct.length === 0){
            return res.status(404).json({status:false, message: "No products to show"})
        }

        //map the products to include only the name of the category
        const productList = findProduct.map(product => ({
            ...product.toObject(),
            productCategory: product.productCategory.name
        }))
        res.status(200).json({status: true, message: "product fetch successfully", product: productList})
    }catch(error){
        console.log("Internal server error while fetching category list: ",error);
        res.status(500).json({status:false, message:"Internal server error while fetching category list", error: error.message})
    }
}

const getProductListByCategory = async(req, res) => {
    try{
        const categoryName = req.params.categoryName;


        // Find the category document for the given category name
         const category = await CategorySchema.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ status: false, message: `Category ${categoryName} not found` });
        }
 
        // Find products belonging to the category
        const products = await ProductSchema.find({ productCategory: category._id })
            .populate("productCategory", "name").select('-__v -created_date -updated_date');
 
        if (!products || products.length === 0) {
           return res.status(404).json({ status: false, message: `No products found for category ${categoryName}` });
        }
 
        res.status(200).json({ status: true, message: `Products found for category ${categoryName}`, products });

    }catch(error){
        console.error("Internal server error while fetching products by category:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message});
    }
}

const getProductById = async(req, res) => {
    try{
        const id = req.params.id;

 
        // Find products belonging to the category
        const product = await ProductSchema.findById(id)
            .populate("productCategory", "name").select('-__v -created_date -updated_date');
 
        if (!product) {
           return res.status(404).json({ status: false, message: `No products found for id: ${id} `});
        }
 
        res.status(200).json({ status: true, message: `Product fetch success`, product });

    }catch(error){
        console.error("Internal server error while fetching products by category:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message});
    }
}


module.exports = {
    getProductList,
    getProductListByCategory,
    getProductById,
}