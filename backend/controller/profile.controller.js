const User = require('../model/user.model');

exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user._id,
        fullname: req.user.fullname,
        username: req.user.username,
        gender: req.user.gender,
        profile_picture: req.user.profile_picture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

