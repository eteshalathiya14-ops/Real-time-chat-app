const express = require ('express')
const routes = express.Router();

const auth = require("../controller/auth.controller")
const upload = require ("../middleware/upload.middleware")

routes.post('/login',auth.login);
routes.post('/signup', upload.single("profile_picture"), auth.signup);
routes.post('/logout',auth.logout);

module.exports= routes