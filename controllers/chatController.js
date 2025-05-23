const Chat = require("../models/Chat");
const mongoose = require("mongoose");
const Session = require("../models/ChatSession");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const OrderHistoryCredit = require("../models/OrderHistoryCredit");
exports.createSession = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const session = new Session({ userId, sessionId: uuidv4() });
        await session.save();

        res.status(201).json({ message: "Session created successfully", sessionId: session.sessionId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.storeChat = async (req, res) => {
//     try {
//         const { userId,sessionId } = req.params;
//         const { messages } = req.body;

//         if (!sessionId || !messages || !Array.isArray(messages) || messages.length === 0) {
//             return res.status(400).json({ error: "Invalid request. sessionId and messages array are required." });
//         }

//         const sessionExists = await Session.findOne({ sessionId });
//         if (!sessionExists) {
//             return res.status(404).json({ error: "Session not found. Please create a session first." });
//         }

//         const bulkChats = messages.map(msg => ({
//             sessionId,
//             sender: msg.sender,
//             message: msg.message
//         }));

//         await Chat.insertMany(bulkChats);

//         res.status(201).json({ message: "Chats stored successfully" });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.storeChat = async (req, res) => {
    try {
        const { userId, sessionId } = req.params;
        const { messages } = req.body;

        if (!sessionId || !messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Invalid request. sessionId and messages array are required." });
        }

        
        const sessionExists = await Session.findOne({ sessionId });
        if (!sessionExists) {
            return res.status(404).json({ error: "Session not found. Please create a session first." });
        }

        const userCredit = await OrderHistoryCredit.findOne({ user_id: userId }).sort({ payment_date: -1 });

        if (!userCredit || userCredit.credit <= 0) {
            return res.status(400).json({ error: "Insufficient credits. Please purchase more credits." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }


        const userMessages = messages.filter(msg => msg.sender === "user");

       
        const requiredCredits = Math.ceil(userMessages.length / userCredit.questionPerCredit);

        if (userCredit.credit < requiredCredits) {
            return res.status(400).json({ error: "Not enough credits for this chat session." });
        }

      
        userCredit.credit -= requiredCredits;
        await userCredit.save();

        user.available_credits = userCredit.credit;
        await user.save();

        
        const bulkChats = messages.map(msg => ({
            sessionId,
            sender: msg.sender,
            message: msg.message
        }));
        await Chat.insertMany(bulkChats);

        res.status(201).json({ 
            message: "Chats stored successfully", 
            userMessagesCount: userMessages.length,
            remainingCredits: userCredit.credit 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getChatsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const sessions = await Session.find({ userId }).lean();

        if (!sessions.length) {
            return res.status(404).json({ error: "No chat history found for this user." });
        }

        const chatHistories = await Promise.all(sessions.map(async (session) => {
            const chats = await Chat.find({ sessionId: session.sessionId }).sort({ timestamp: 1 }).lean();

            return {
                sessionId: session.sessionId,
                chats: chats.map(chat => ({
                    sender: chat.sender,
                    message: chat.message
                }))
            };
        }));

        res.status(200).json(chatHistories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
