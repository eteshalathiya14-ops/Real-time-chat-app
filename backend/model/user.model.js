const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const  userSchema = new mongoose.Schema({
    _id:{
        type:String,    
        default:uuidv4
    },
    fullname:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    confirmpassword:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true,
        enum:['male','female']
    },
    profile_picture:{
        type:String,
        default:null
    },
},
    { timestamps: true }
);
module.exports= mongoose.model("User",userSchema);

