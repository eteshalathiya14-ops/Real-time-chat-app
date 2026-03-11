const express = require("express");
const routes = express.Router();

const usersidebar = require('../controller/user.controller');
const auth = require('../middleware/auth.middleware');

routes.get("/",auth,usersidebar.getUsersForSidebar)

module.exports = routes;    