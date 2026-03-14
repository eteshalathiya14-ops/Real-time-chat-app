const User = require('../model/user.model')

exports.getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const searchTerm = req.query.search?.trim();

        const query = {
            _id: { $ne: loggedInUserId }
        };

        if (searchTerm && searchTerm.length > 0) {
            query.$or = [
                { username: { $regex: searchTerm, $options: 'i' } },
                { fullname: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const filterdUsers = await User.find(query).select("-password");

        res.status(200).json({
            success: true,
            data: filterdUsers
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
