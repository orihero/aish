import { Chat } from '../models/chat.model.js';
import { continueChat } from '../services/chat.service.js';

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization
    if (chat.candidate.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization
    if (chat.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Continue chat with new message
    const updatedChat = await continueChat(chat._id, req.body.message);
    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 