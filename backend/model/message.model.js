const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema(
{
    _id:{
        type:String,
        default :uuidv4
    },
    senderId:{
        type:String,
        ref :"User",
        required:true
    },
    receiverId:{
        type:String,
        ref :"User",
        required:true
    },
    message:{
        type:String,
        required:true
    }
},
{ timestamps:true }
);

module.exports = mongoose.model("Message", messageSchema);