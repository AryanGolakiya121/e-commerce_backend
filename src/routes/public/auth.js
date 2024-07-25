const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailed, logout, registerUser, verifyUser, loginUser } = require('../../controllers/auth.controller');
const { loginValidator } = require('../../validator/user.validator');

const routes = express.Router()


routes.get("/google",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: '/login/failed'
    })
)

routes.get("/login/success",loginSuccess)

routes.get("/login/failed", loginFailed)

routes.get("/logout", logout)

routes.get("/google", passport.authenticate("google", ["profile", "email"]))


//Registration
routes.post('/register', registerUser)

//Veriffy email
routes.get('/verify/:id/:token', verifyUser)

//Login user
routes.post('/login', loginValidator(), loginUser)

module.exports = routes;

