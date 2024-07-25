const UserSchema = require('../models/user.schema')
const passport = require('passport');
const TokenSchema = require("../models/token.schema");
const sendEmail = require("../helper/sendEmail");
const { encrypt, comparePassword, generateToken } = require("../helper/utils");
const crypto = require('crypto');


const registerUser = async(req, res,) => {
    try{
        const body = req.body;
        
        const findUser = await UserSchema.findOne({email: body.email})
        
        if(findUser){
            return res.status(400).json({status:false, message: 'User already exists please login'})
        }

        const hashPassword = await encrypt(body.password)
        const hashConfirmPassword = await encrypt(body.confirmPassword)

        const newUser = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashPassword,
            confirmPassword: hashConfirmPassword,
            phoneNumber: body.phoneNumber,
            isAdmin: body && body.isAdmin ? body.isAdmin : false,
            profileImage: body && body.profileImage ? body.profileImage : null,
            address: body && body.address ? body.address : null,
            city: body && body.city ? body.city : null,
            state: body && body.state ? body.state : null,
            country: body && body.country ? body.country : null,
            pincode: body && body.pincode ? body.pincode : null,
            googleId: body && body.googleId ? body.googleId : null,
            isVerified: false,
            registrationDate: body && body.registrationDate ? body.registrationDate : Date.now(),
            orderHistory: [],
            lastLogin: null
        }

        const addUser = await UserSchema.create(newUser)

        //Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex")

        //add token to table

        const newToken = {
            userId: addUser._id,
            token: verificationToken,
        }
        
        const addToken = await TokenSchema.create(newToken)

        // const verificationLink = `${req.protocol}://${req.get('host')}/verify-email/${addToken.token}`
        const verificationLink = `${process.env.BASE_URL}/api/public/auth/verify/${addUser.id}/${addToken.token}`;

        await sendEmail(addUser.email, "Verify Email", verificationLink)


        res.status(201).json({status:true, message: `An Email sent to your account please verify`})

        // res.status(201).json({status:true, message: 'User created', user: newUser})


    }catch(error){
        console.log("Internal server error while addind new user: ",error);
        res.status(500).json({status:false, message: 'Internal server error while adding new user', error: error.message})
    }
}

const verifyUser = async(req, res) => {
    try{
        const id = req.params.id;
        const token = req.params.token;

        const user = await UserSchema.findOne({_id: id}).select('-creaed_date -__v -updated_date')

        if(!user){
            return res.status(400).json({status:false, message:"Invalid link"})
        }

        const findToken = await TokenSchema.findOne({userId: user._id, token: token})

        if(!findToken){
            return res.status(400).json({status:false, message:"Invalid token or link"})
        }

        await UserSchema.updateOne({_id: user._id}, {isVerified: true})

        await TokenSchema.findByIdAndDelete(findToken._id)

        res.status(200).json({status:true, message:"Email verified sucessfully"})
    }catch(error){
        console.log('Error during verify user email: ', error);
        res.status(500).json({status:false, message:'Error during verify user email', error: error.message})
    }
}

const loginUser = async(req, res) => {
    try{
        const body = req.body;

        //check if user is exist or not
        const user = await UserSchema.findOne({email: body.email})
        if(!user){
            return res.status(404).json({status:false, message: `User not found with email: ${body.email}`})
        }
        if(user.isVerified !== true){
            return res.status(400).json({status:false, message: "Please verify your account first"})
        }

        const isMatch = await comparePassword(body.password, user.password)
        if(!isMatch){
            return res.status(401).json({status:false, message: "Invaid password"})
        }
        const userObject = {
            userId: user._id, 
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone_number: user.phoneNumber,
            isAdmin: user.isAdmin,
        }
        const options = {
            maxAge: 20 * 60 * 1000, //expire in 20minutes
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        const token = await generateToken(userObject)
        userObject.token = token
        res.cookie("token", token, options)
        
        await UserSchema.updateOne({_id: user._id}, {last_login: Date.now()})
        res.status(200).json({status:true, message: "Login success", data:userObject})
    }catch(err){
        console.log("Internal server error while login: ",err);
        res.status(500).json({status:false, message:"Internal server error while login", error:err.message})
    }
}




//Login with google

const loginSuccess = async(req, res) => {
    try{
        if(req.user){
            // console.log('req.user: ',req.user._json.name);
            res.status(200).json({status:true, message: 'Login success', user: req.user})
        }else{
            res.status(403).json({status:false, message: 'Not authorizedd'})
        }
    }catch(error){
        console.log('Internal server error while login');
        res.status(500).json({status:false, message: 'Internal server error while login', error: error.message})
    }
}

const googleCallback  = async(req, res) => {
    try{
        passport.authenticate("google", {
            successRedirect: process.env.CLIENT_URL,
            failureRedirect: 'login/failed'
        })(req, res, () => {
            res.redirect('/');
        })
    }catch(error){
        console.log('Internal server error in googleCallback: ',error);
        res.status(500).json({status:false, message: 'Internal server error in googleCallback', error: error.message})
    }
}

const loginFailed = (req, res) => {
    res.status(401).json({
        status:false,
        message: "Login failed"
    })
}
const logout = (req, res) => {
    try{
        req.logout();
        res.redirect(process.env.CLIENT_URL);
    }catch(error){
        console.log('Internal server error in logout: ',error);
        res.status(500).json({status:false, message: 'Internal server error in logout', error: error.message})
    }
};

module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    loginSuccess,
    googleCallback,
    loginFailed,
    logout
}