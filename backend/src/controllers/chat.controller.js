import { Chat } from '../models/chat.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { continueChat } from '../services/chat.service.js';
import { Logger } from '../utils/logger.js';

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

// Vacancy Creation Chat Functions
export const startVacancyCreationChat = async (req, res) => {
  try {
    Logger.info('🚀 Starting vacancy creation chat', { userId: req.user._id });

    // Check if user already has an active vacancy creation chat
    const existingChat = await Chat.findOne({
      candidate: req.user._id,
      chatType: 'vacancy_creation',
      status: 'vacancy_creation_in_progress'
    });

    if (existingChat) {
      Logger.info('📝 Returning existing vacancy creation chat', { 
        chatId: existingChat._id,
        userId: req.user._id 
      });
      return res.json(existingChat);
    }

    // Create new vacancy creation chat
    const chat = new Chat({
      candidate: req.user._id,
      chatType: 'vacancy_creation',
      status: 'vacancy_creation_in_progress',
      messages: [{
        role: 'assistant',
        content: 'Hello! I\'m here to help you create a vacancy. Please tell me about the position you want to create - what role are you hiring for, what are the main responsibilities, and any specific requirements you have in mind?',
        messageType: 'vacancy_creation_start',
        metadata: {
          step: 'initial_greeting'
        }
      }]
    });

    await chat.save();
    
    Logger.success('✅ Vacancy creation chat started', { 
      chatId: chat._id,
      userId: req.user._id 
    });

    res.status(201).json(chat);
  } catch (error) {
    Logger.error('❌ Error starting vacancy creation chat', error);
    res.status(500).json({ message: error.message });
  }
};

export const continueVacancyCreationChat = async (req, res) => {
  try {
    const { message, messageType = 'normal' } = req.body;
    
    Logger.info('💬 Continuing vacancy creation chat', { 
      chatId: req.params.chatId,
      userId: req.user._id,
      messageType 
    });

    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization
    if (chat.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to continue this chat' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      messageType,
      metadata: {}
    });

    // Generate AI response based on conversation context
    const aiResponse = await generateVacancyCreationResponse(chat, message);
    
    chat.messages.push(aiResponse);
    
    // Update chat status based on AI response
    if (aiResponse.messageType === 'vacancy_creation_complete') {
      chat.status = 'vacancy_creation_completed';
    }

    await chat.save();
    
    Logger.success('✅ Vacancy creation chat continued', { 
      chatId: chat._id,
      messageCount: chat.messages.length 
    });

    res.json(chat);
  } catch (error) {
    Logger.error('❌ Error continuing vacancy creation chat', error);
    res.status(500).json({ message: error.message });
  }
};

export const finishVacancyCreation = async (req, res) => {
  try {
    Logger.info('🏁 Finishing vacancy creation', { 
      chatId: req.params.chatId,
      userId: req.user._id 
    });

    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization
    if (chat.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to finish this chat' });
    }

    // Extract vacancy data from chat messages and metadata
    const vacancyData = extractVacancyDataFromChat(chat);
    
    if (!vacancyData.title || !vacancyData.description) {
      return res.status(400).json({ 
        message: 'Insufficient vacancy data. Please provide at least title and description.' 
      });
    }

    // Create the vacancy
    const vacancy = new Vacancy({
      ...vacancyData,
      creator: req.user._id,
      status: 'draft' // Start as draft, user can publish later
    });

    await vacancy.save();

    // Update chat with vacancy reference and completion status
    chat.vacancy = vacancy._id;
    chat.status = 'vacancy_creation_completed';
    chat.vacancyData = vacancyData;
    
    chat.messages.push({
      role: 'assistant',
      content: `Great! I've created your vacancy "${vacancy.title}". You can now review and publish it when you're ready.`,
      messageType: 'vacancy_creation_complete',
      metadata: {
        vacancyId: vacancy._id,
        vacancyTitle: vacancy.title
      }
    });

    await chat.save();
    
    Logger.success('🎉 Vacancy creation completed', { 
      chatId: chat._id,
      vacancyId: vacancy._id,
      title: vacancy.title 
    });

    res.json({
      chat,
      vacancy,
      message: 'Vacancy created successfully!'
    });
  } catch (error) {
    Logger.error('❌ Error finishing vacancy creation', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate AI responses for vacancy creation
async function generateVacancyCreationResponse(chat, userMessage) {
  const messages = chat.messages;
  const lastMessages = messages.slice(-6); // Get last 6 messages for context
  
  // Simple AI logic - in a real implementation, you'd use OpenAI or similar
  let response = '';
  let messageType = 'vacancy_creation_progress';
  let metadata = {};

  // Analyze the conversation to determine what information we have
  const conversationText = messages.map(m => m.content).join(' ');
  
  if (conversationText.toLowerCase().includes('title') || 
      conversationText.toLowerCase().includes('position') ||
      conversationText.toLowerCase().includes('role')) {
    
    if (!conversationText.toLowerCase().includes('description') || 
        !conversationText.toLowerCase().includes('responsibilities')) {
      response = 'Great! Now can you tell me more about the job description and main responsibilities for this position?';
      metadata.step = 'collecting_description';
    } else if (!conversationText.toLowerCase().includes('requirements') || 
               !conversationText.toLowerCase().includes('skills')) {
      response = 'Perfect! What are the key requirements and skills needed for this role?';
      metadata.step = 'collecting_requirements';
    } else if (!conversationText.toLowerCase().includes('salary') || 
               !conversationText.toLowerCase().includes('compensation')) {
      response = 'Excellent! What salary range are you offering for this position?';
      metadata.step = 'collecting_salary';
    } else if (!conversationText.toLowerCase().includes('location') || 
               !conversationText.toLowerCase().includes('remote')) {
      response = 'Almost done! What\'s the work location? Is this remote, hybrid, or on-site?';
      metadata.step = 'collecting_location';
    } else {
      response = 'Perfect! I have all the information I need. Would you like me to create the vacancy now?';
      messageType = 'vacancy_ready';
      metadata.step = 'ready_to_create';
    }
  } else {
    response = 'I\'d love to help you create a vacancy! Could you start by telling me what position you\'re hiring for?';
    metadata.step = 'collecting_title';
  }

  return {
    role: 'assistant',
    content: response,
    messageType,
    metadata
  };
}

// Helper function to extract vacancy data from chat
function extractVacancyDataFromChat(chat) {
  const messages = chat.messages;
  const conversationText = messages.map(m => m.content).join(' ');
  
  // Simple extraction logic - in a real implementation, you'd use NLP
  const vacancyData = {
    title: extractTitle(conversationText),
    description: extractDescription(conversationText),
    requirements: extractRequirements(conversationText),
    responsibilities: extractResponsibilities(conversationText),
    salary: extractSalary(conversationText),
    employmentType: 'full-time', // Default
    workType: 'remote', // Default
    location: {
      country: 'Unknown',
      city: 'Unknown',
      type: 'remote'
    },
    category: null, // Will need to be set by user
    skills: []
  };

  return vacancyData;
}

// Simple extraction functions - these would be more sophisticated in production
function extractTitle(text) {
  // Look for patterns like "hiring for", "position", "role"
  const titleMatch = text.match(/(?:hiring for|position|role)[\s:]+([^.]+)/i);
  return titleMatch ? titleMatch[1].trim() : 'Software Developer';
}

function extractDescription(text) {
  // Extract description from user messages
  const userMessages = text.split('assistant:')[0]; // Get user part
  return userMessages.substring(0, 500) + '...'; // Truncate
}

function extractRequirements(text) {
  // Simple extraction - look for requirement keywords
  const requirements = [];
  if (text.toLowerCase().includes('experience')) requirements.push('Relevant work experience');
  if (text.toLowerCase().includes('degree')) requirements.push('Bachelor\'s degree');
  if (text.toLowerCase().includes('skills')) requirements.push('Technical skills');
  return requirements.length > 0 ? requirements : ['Relevant experience'];
}

function extractResponsibilities(text) {
  // Simple extraction
  return ['Perform assigned tasks', 'Collaborate with team', 'Meet project deadlines'];
}

function extractSalary(text) {
  // Look for salary mentions
  const salaryMatch = text.match(/(\d+)[\s-]*(\d+)?[\s]*(\$|USD|dollars?)/i);
  if (salaryMatch) {
    return {
      min: parseInt(salaryMatch[1]) * 1000,
      max: salaryMatch[2] ? parseInt(salaryMatch[2]) * 1000 : parseInt(salaryMatch[1]) * 1000 + 10000,
      currency: 'USD',
      isNegotiable: false
    };
  }
  
  return {
    min: 50000,
    max: 80000,
    currency: 'USD',
    isNegotiable: true
  };
} 