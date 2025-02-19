const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async(req,res) => {
    const { content, chatId } = req.body;
    if(!content || !chatId){
        console.log("Invalid data passed into the request");
        return res.sendStatus(400);
    }
    var newMessage = {       //Chat model haas these three fields in messageModel.js inside the model folder
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);  //Message.create(newMessage) is used to insert a new message document into the MongoDB database using Mongoose.
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async(req,res) => {
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate(
            "sender", "name pic email"
        ).populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage,allMessages };