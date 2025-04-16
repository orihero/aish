import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getChat, sendMessage } from '../controllers/chat.controller.js';

const router = express.Router();

// Get chat history
router.get('/:chatId', auth, getChat);

// Send message in chat
router.post('/:chatId/messages', auth, sendMessage);

export default router;