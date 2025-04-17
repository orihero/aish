import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getChat, sendMessage, getMyChats } from '../controllers/chat.controller.js';

const router = express.Router();

// Get all chats for the authenticated user
router.get('/', auth, getMyChats);

// Get chat history
router.get('/:chatId', auth, getChat);

// Send message in chat
router.post('/:chatId/messages', auth, sendMessage);

export default router;