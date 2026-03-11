const { promises } = require('fs');
const Conversation = require('../model/conversation.model');
const Message = require('../model/message.model')

exports.sendmessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.userid;
        const senderId = req.User._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                message: [] // initialize as array
            });
        }

        if (!message || !receiverId) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: "Message and receiverId are required"
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId: conversation._id // Optionally link message to conversation
        });

        // Ensure conversation.message is an array
        if (!Array.isArray(conversation.message)) {
            conversation.message = [];
        }

        conversation.message.push(newMessage._id);
        await conversation.save();

        res.status(200).json({
            code: 200,
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Server error"
        });
    }
}

exports.getmessage = async(req,res)=>{
   try{
      const {userid:userToChatId}= req.params;
      const senderId = req.User._id;

      const conversation = await Conversation.findOne({
         participants : {$all :[senderId,userToChatId]},
      }).populate('message');
      res.status(200).json(conversation ? conversation.message : []);
   }  catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            success: false,
            message: "Server error"
        });
      } 
}