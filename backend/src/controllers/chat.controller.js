import { Chat } from '../models/chat.model.js';
import { continueChat } from '../services/chat.service.js';

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('candidate', '_id firstName lastName email')
      .populate('application', 'user')
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          populate: {
            path: 'company',
            select: 'name logo'
          }
        }
      });
      
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    console.log('====================================');
    console.log('Chat:', chat);
    console.log('User making request:', req.user._id);
    console.log('====================================');

    // Check authorization - allow if user is the candidate or an admin
    const isAuthorized = (
      // Check if user is the candidate (either directly or through application)
      (chat.candidate && chat.candidate._id.toString() === req.user._id.toString()) ||
      (chat.application && chat.application.user.toString() === req.user._id.toString()) ||
      // Or if user is an admin
      req.user.role === 'admin'
    );

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    // Filter to include only user and assistant messages
    const filteredChat = {
      ...chat.toObject(),
      messages: chat.messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
    };

    res.json(filteredChat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('candidate', '_id firstName lastName email');
      
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization - allow if user is the candidate
    const isAuthorized = chat.candidate && 
      chat.candidate._id.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Continue chat with new message
    const updatedChat = await continueChat(chat._id, req.body.message);
    res.json(updatedChat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyChats = async (req, res) => {
  try {
    // Find all chats where the user is either the candidate directly or through an application
    const chats = await Chat.find({
      $or: [
        { candidate: req.user._id },
        { 'application.user': req.user._id }
      ]
    })
    .populate('candidate', '_id firstName lastName email')
    .populate({
      path: 'application',
      populate: [
        {
          path: 'job',
          populate: {
            path: 'company',
            select: 'name logo description'
          },
          select: 'title description requirements company'
        }
      ]
    })
    .sort({ updatedAt: -1 });

    // Filter to include only user and assistant messages for each chat
    const filteredChats = chats.map(chat => ({
      ...chat.toObject(),
      messages: chat.messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
    }));

    res.json(filteredChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: error.message });
  }
}; 