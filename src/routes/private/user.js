const express = require('express');
const { getUserDetails, logoutUser } = require('../../controllers/user.controller');

const routes = express.Router()

routes.get('/logout',logoutUser)
routes.get('/profile', getUserDetails)

module.exports = routes;