const express = require("express");
const routes = express.Router();

const usersidebar = require('../controller/user.controller');
const profileController = require('../controller/profile.controller');
const auth = require('../middleware/auth.middleware');

routes.get("/",auth,usersidebar.getUsersForSidebar)
routes.get("/profile", auth, profileController.getProfile);

module.exports = routes;
