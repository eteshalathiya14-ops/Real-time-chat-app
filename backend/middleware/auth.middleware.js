const jwt  = require('jsonwebtoken');
const User = require('../model/user.model')

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        req.user = user; 

        next();

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
}

module.exports = auth;