const CategorySchema = require("../models/category.schema");


const getCategoryList = async(req, res) => {
    try{
        const findCategory = await CategorySchema.find().select('-__v -updated_date -created_date')

        if(!findCategory || findCategory.length === 0){
            return res.status(404).json({status:false, message: "No categories to show"})
        }
        res.status(200).json({status: true, message: "Categories fetch successfully", category: findCategory})
    }catch(error){
        console.log("Internal server error while fetching category list: ",error);
        res.status(500).json({status:false, message:"Internal server error while fetching category list", error: error.message})
    }
}

module.exports = {
    getCategoryList,
}