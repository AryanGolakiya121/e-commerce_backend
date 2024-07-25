const UserSchema = require("../models/user.schema");


const logoutUser = async(req, res, next) => {
    try{
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({status: true, message: "Logged Out",});
    }catch(error){
        console.log("Internal server error while logout user: ", error);
        res.status(500).json({status:false, message: "Internal server error while logout user", error:error.message})
    }
}
const getUserDetails = async(req, res, next) => {
    try{
        const id = req.user._id;
   
        const user = await UserSchema.findById(id).select('-__v -created_date -updated_date')
       
        res.status(200).json({status: true,
            message: "User details fetch successfully", user});
    }catch(err){
        console.log("Internal server while get user details");
        res.status(500).json({status: false, message:"Internal server error while fething user details", error: err.message})
    }
}

module.exports = {
    logoutUser,
    getUserDetails
}