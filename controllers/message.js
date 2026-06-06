const prisma = require("../prisma"); 

async function sendMessage(req, res) {
    const { recipientId } = req.params;
    const { message_content } = req.body;
    const senderId = req.user.user_id;

    try {
        
        const existingParticipant = await prisma.conversation_participants.findFirst({
            where: {
                user_id: senderId,
                conversations: {
                    conversation_participants: {
                        some: { user_id: parseInt(recipientId) }
                    }
                }
            },
            select: { conversation_id: true }
        });

        let conversationId;

        if (existingParticipant) {
            conversationId = existingParticipant.conversation_id;
        } else {
            const newRoom = await prisma.conversations.create({
                data: {
                    conversation_participants: {
                        create: [
                            { user_id: senderId },
                            { user_id: parseInt(recipientId) }
                        ]
                    }
                }
            });
            conversationId = newRoom.conversation_id;
        }

        const message = await prisma.messages.create({
            data: {
                conversation_id: conversationId,
                sender_id: senderId,
                message_content: message_content.trim()
            }
        });

        return res.status(201).json({ message: "Message sent.", payload: message });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getConversationsList(req, res) {
    const userId = req.user.user_id;

    try {
        const chats = await prisma.conversation_participants.findMany({
            where: { user_id: userId },
            include: {
                conversations: {
                    include: {
                        conversation_participants: {
                            where: { NOT: { user_id: userId } },
                            include: {
                                users: {
                                    select: { user_id: true, username: true, profile_picture: true }
                                }
                            }
                        },
                        messages: {
                            orderBy: { created_at: "desc" },
                            take: 1
                        }
                    }
                }
            }
        });

        return res.status(200).json({ message: "Inbox loaded.", chats });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getMessagesInConversation(req, res) {
    const { conversationId } = req.params;
    const userId = req.user.user_id;

    try {
        const isParticipant = await prisma.conversation_participants.findFirst({
            where: { conversation_id: parseInt(conversationId), user_id: userId }
        });

        if (!isParticipant) {
            return res.status(403).json({ error: "Access denied. You aren't part of this conversation thread." });
        }

        const thread = await prisma.messages.findMany({
            where: { conversation_id: parseInt(conversationId) },
            orderBy: { created_at: "asc" }
        });

        return res.status(200).json({ thread });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { sendMessage, getConversationsList, getMessagesInConversation };