// routes/message.js
const express = require('express');
const { getConversations, getConversationDetails, sendMessage, createConversation } = require('../controllers/messageController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.post('/conversation', authenticateToken, createConversation);
router.get('/conversation/:id', authenticateToken, getConversationDetails);
router.post('/send', authenticateToken, sendMessage);

module.exports = router;