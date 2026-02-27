import Chat from "../models/chat.js";

export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatData = {
            userId,
            messages: [],
            name: "new chat",
            userName: req.user.name
        };

        await Chat.create(chatData);

        res.status(201).json({
            success: true,
            message: "chat created"
        });

    } catch (err) {
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
};

export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            chats
        });


    } catch (err) {
        res.status(401).json({
            success: false,
            message: "could not fetch chats"
        });
    };
};

export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;

        await Chat.deleteOne({ _id: chatId, userId });

        res.status(200).json({
            success: true,
            message: "chat deleted"
        });

    } catch (err) {
        res.status(401).json({
            success: false,
            message: "could not delete chat"
        });
    }
};