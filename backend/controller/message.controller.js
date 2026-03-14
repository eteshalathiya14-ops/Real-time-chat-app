const Conversation = require('../model/conversation.model');
const Message = require('../model/message.model');

exports.sendmessage = async (req, res) => {
  try {

    const { message } = req.body;
    const receiverId = req.params.userid;   
    const senderId = req.user._id;         

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required"
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        message: []
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    conversation.message.push(newMessage._id);
    await conversation.save();

    res.status(200).json({
      success: true,
      data: newMessage
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};


exports.getmessage = async (req, res) => {
  try {

    const userToChatId = req.params.userid;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] }
    }).populate("message");

    res.status(200).json({
      success: true,
      data: conversation ? conversation.message : []
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
}; 