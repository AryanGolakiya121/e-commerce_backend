const expess = require('express');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user.schema');
const { json } = require('body-parser');

const userAuth = async(req, res, next) => {
    try{
        const { token } = req.cookies;

        if(!token){
            return res.status(401).send({ status: false, message: "Unauthorized: Token not found" })
        }

        //verifying token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)

        //finding user with details decoded from token
        const userData = await UserSchema.findById(decodedData.user.userId)

        if (!userData) {
            return res.status(403).send({ status: false, message: "Invalid token" })
        }
        // setting req.user to user found from token and req.token to token
        req.token = token
        req.user = userData
        next();
    }catch(error){
        console.log("Error in userAuth: ",error);
        if(error.message === 'jwt malformed'){
            return res.status(403).json({status:false, message: "Invalid token"})
        }else{
            return res.status(403).json({status:false, message: error.message})
        }
    }
}

const adminAuth = async(req, res, next) => {
    try{
        const { token } = req.cookies;

        if(!token){
            return res.status(401).send({ status: false, message: "Unauthorized: Token not found" })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const userData = await UserSchema.findOne({_id: decodedData.user.userId})
        
        if(!userData){
            return res.status(403).send({ status: false, message: "Invalid token" })
        }
        
        if(!userData.isAdmin){
            return res.status(401).json({status:false, message: "Not authorized"})
        }

        // setting req.user to user found from token and req.token to token
        req.token = token
        req.user = userData
        next();
    }catch(error){
        console.log("Error in adminAuth: ",error);
        if(error.message === 'jwt malformed'){
            return res.status(403).json({status:false, message: "Invalid token"})
        }else{
            return res.status(403).json({status:false, message: error.message})
        }
    }
}

module.exports = {
    userAuth,
    adminAuth,
}