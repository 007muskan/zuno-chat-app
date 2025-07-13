const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });


    await chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const allMessages= asyncHandler ( async(req,res) => {
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const clearChat = async (req, res) => {
  try {
    await Message.deleteMany({ chat: req.params.chatId });
    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear chat" });
  }
};

module.exports = { sendMessage, allMessages, clearChat };

