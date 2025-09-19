import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { 
  getChat, 
  sendMessage, 
  getMyChats,
  startVacancyCreationChat,
  continueVacancyCreationChat,
  finishVacancyCreation
} from '../controllers/chat.controller.js';

const router = express.Router();

// Get all chats for the authenticated user
router.get('/', auth, getMyChats);

// Get chat history
router.get('/:chatId', auth, getChat);

// Send message in chat
router.post('/:chatId/messages', auth, sendMessage);

// Vacancy Creation Chat Routes
router.post('/vacancy-creation/start', auth, startVacancyCreationChat);
router.post('/vacancy-creation/:chatId/continue', auth, continueVacancyCreationChat);
router.post('/vacancy-creation/:chatId/finish', auth, finishVacancyCreation);

export default router;