const express = require("express");
const routes = express.Router();

const message = require('../controller/message.controller');
const auth = require ('../middleware/auth.middleware.js')

routes.post('/send/:userid' ,auth,message.sendmessage);
routes.get('/getmessage/:userid' ,auth,message.getmessage);

module.exports = routes;