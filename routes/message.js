const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { sendMessage, getConversationsList, getMessagesInConversation } = require("../controllers/message");
const { validateMessageInput } = require("../middleware/message"); 

router.post("/to/:recipientId", authenticateToken, validateMessageInput, sendMessage);
router.get("/list", authenticateToken, getConversationsList);
router.get("/room/:conversationId", authenticateToken, getMessagesInConversation);

module.exports = router;