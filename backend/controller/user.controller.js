const User = require('../model/user.model')

exports.getUsersForSidebar = async (req,res)=>{
    try{

        const loggedInUserId = req. User._id
        const filterdUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-password")

         res.status(200).json(filterdUsers);

    }catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Server error"
        });
    }
}