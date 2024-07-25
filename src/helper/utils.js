const jwt = require('jsonwebtoken')
const passwordHash = require('pbkdf2-password-hash')

const encrypt = async(password) => {
    return await passwordHash.hash(password, {iterations: 100, digest: 'sha1', keylen: 16, saltlen: 16})
    
}

const comparePassword = async(plainPassword, hashedPassword) => {
    return await passwordHash.compare(plainPassword, hashedPassword)
}

const generateToken = async(user) => {
    try{
        const token = jwt.sign({user}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JET_EXPIRATION_TIME})
        return token;
    }catch(error){
        console.log('Error while generating token: ',err)
        throw new Error(err)
    }
}

const checkPermission = async(isAdmin, user) => {
    if(!user || !isAdmin){
        return false
    }
    if(user.isAdmin !== isAdmin){
        return false
    }
    return true;
}

module.exports = {
    encrypt,
    comparePassword,
    generateToken,
    checkPermission
}