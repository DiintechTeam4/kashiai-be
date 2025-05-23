const VoiceChat = require("../models/VoiceChat");
const VoiceChatSession = require("../models/VoiceChatSession");
const { v4: uuidv4 } = require("uuid");

exports.storeVoiceChat = async (req, res) => {
    try {
        const { userId } = req.params;
        const { messages } = req.body;

        if (!userId || !messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Invalid request. userId and messages array are required." });
        }

        const session = new VoiceChatSession({ userId, sessionId: uuidv4() });
        await session.save();

        
        const bulkChats = messages.map(msg => ({
            sessionId: session.sessionId,
            sender: msg.sender,
            message: msg.message
        }));

        await VoiceChat.insertMany(bulkChats);

        res.status(201).json({ message: "Voice chat stored successfully", sessionId: session.sessionId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getVoiceChatsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

      
        const sessions = await VoiceChatSession.find({ userId }).lean();

        if (!sessions.length) {
            return res.status(404).json({ error: "No voice chat history found for this user." });
        }

     
        const chatHistories = await Promise.all(sessions.map(async (session) => {
            const chats = await VoiceChat.find({ sessionId: session.sessionId }).sort({ timestamp: 1 }).lean();

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
