const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const generateToken = require("../utills/generatetoken");

exports.signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmpassword, gender } = req.body;

    if (password !== confirmpassword) {
      return res.json({
        code: 400,
        success: false,
        message: "Password and Confirm Password does not match"
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({
        code: 400,
        success: false,
        message: "Username already exists"
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    let profilePicture = null;

    if (req.file) {
      profilePicture = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    }

    const newUser = await User.create({
      fullname,
      username,
      password: hashpassword,
      gender,
      profile_picture: profilePicture
    });

    // token generate
    const token = generateToken(newUser._id, res);

    res.json({
      code: 200,
      success: true,
      message: "User created successfully",
      token: token,
        data:{
          id:newUser._id,
          fullname:newUser.fullname,
          username:newUser.username,
          gender:newUser.gender,
          profile_picture:newUser.profile_picture
        }

    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 500,
      success: false,
      message: "Server error"
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { username, password } = req.body;

    // user check
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        code: 400,
        success: false,
        message: "Invalid username or password"
      });
    }

    // password check
    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.json({
        code: 400,
        success: false,
        message: "Invalid username or password"
      });
    }

    // token generate
    const token = generateToken(user._id, res);

    res.json({
      code: 200,
      success: true,
      message: "Login successful",
      token: token,
      data: user
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 500,
      success: false,
      message: "Server error"
    });
  }
};

exports.logout = async (req, res) => {
  try{
    res.cookie("jwt","",{maxAge :0})
    res.status(200).json({
      code:200,
      succeess:true,
      message:"logout succeessfully"
    })
  }
 catch (error) {
    console.log(error);
    res.json({
      code: 500,
      success: false,
      message: "Server error"
    });
  }
}