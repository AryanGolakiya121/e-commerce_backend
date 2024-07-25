const UserSchema = require("../models/user.schema");

const adAdmin = async() => {
    try{
        // let count = UserSchema.countDocuments()
        const createAdmin = await UserSchema.create()
    }catch(err){
        console.log("Error in addAdmin while add new admin: ",err);
    }
}