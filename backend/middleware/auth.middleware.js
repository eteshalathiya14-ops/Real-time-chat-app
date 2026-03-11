const jwt  = require('jsonwebtoken');
const User = require('../model/user.model')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "No token provided"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Invalid token"
            });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Invalid token"
            });
        }
        req.User = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Server error"
        });
    }
}

module.exports = auth;