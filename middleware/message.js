const prisma = require("../prisma"); 

async function validateMessageInput(req, res, next) {
    try {
        const { recipientId } = req.params;
        const { message_content } = req.body;
        const senderId = req.user.user_id;

        if (!message_content || message_content.trim() === "") {
            return res.status(400).json({ 
                error: "Message content cannot be blank." 
            });
        }

        if (parseInt(recipientId) === senderId) {
            return res.status(400).json({ 
                error: "You cannot start a conversation room with yourself." 
            });
        }

        const recipientExists = await prisma.users.findUnique({
            where: { user_id: parseInt(recipientId) }
        });

        if (!recipientExists) {
            return res.status(404).json({ 
                error: "The user you are trying to message does not exist." 
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { validateMessageInput };