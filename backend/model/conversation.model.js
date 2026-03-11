const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");


const conversationSchema = new mongoose.Schema(
{
    _id:{
        type:String,
        default :uuidv4
    },
    participants:[
        {
            type:String,   // user id
            required:true
        }
    ],

    message: [
        {
            type: String,
            ref: "Message"
        }
    ]
},
{ timestamps:true }
);

module.exports = mongoose.model("Conversation", conversationSchema);