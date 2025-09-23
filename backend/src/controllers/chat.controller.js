import { Chat } from '../models/chat.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { Category } from '../models/category.model.js';
import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js';
import { continueChat } from '../services/chat.service.js';
import { Logger } from '../utils/logger.js';
import { detectLanguage, getLanguageInstruction, getLanguageName } from '../utils/languageDetection.js';
import {
  VACANCY_CREATION_INITIAL_PROMPT,
  VACANCY_CREATION_RESPONSES,
  VACANCY_CREATION_STEPS,
  VACANCY_CREATION_MESSAGE_TYPES,
  VACANCY_COMPLETION_MESSAGE
} from '../prompts/index.js';
import { getVacancyCreationPrompt } from '../prompts/vacancy-creation-multilingual.js';

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
            select: 'name logo creator'
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

    // Check authorization - allow if user is the candidate, employer, or an admin
    const isAuthorized = (
      // Check if user is the candidate (either directly or through application)
      (chat.candidate && chat.candidate._id.toString() === req.user._id.toString()) ||
      (chat.application && chat.application.user.toString() === req.user._id.toString()) ||
      // Check if user is the employer (job creator)
      (chat.application && chat.application.job && chat.application.job.company && 
       chat.application.job.company.creator.toString() === req.user._id.toString()) ||
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
      .populate('candidate', '_id firstName lastName email')
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          populate: {
            path: 'company',
            select: 'creator'
          }
        }
      });
      
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check authorization - allow if user is the candidate, employer, or admin
    const isAuthorized = (
      // Check if user is the candidate
      (chat.candidate && chat.candidate._id.toString() === req.user._id.toString()) ||
      // Check if user is the employer (job creator)
      (chat.application && chat.application.job && chat.application.job.company && 
       chat.application.job.company.creator.toString() === req.user._id.toString()) ||
      // Or if user is an admin
      req.user.role === 'admin'
    );

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
    // Find all chats where the user is either the candidate directly, through an application, or the employer
    const chats = await Chat.find({
      $or: [
        { candidate: req.user._id },
        { 'application.user': req.user._id },
        { 'application.job.company.creator': req.user._id }
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
            select: 'name logo description creator'
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
    // For initial chat, we'll use English as default, but will detect language from user's first message
    const chat = new Chat({
      candidate: req.user._id,
      chatType: 'vacancy_creation',
      status: 'vacancy_creation_in_progress',
      messages: [{
        role: 'assistant',
        content: VACANCY_CREATION_INITIAL_PROMPT,
        messageType: VACANCY_CREATION_MESSAGE_TYPES.VACANCY_CREATION_START,
        metadata: {
          step: VACANCY_CREATION_STEPS.INITIAL_GREETING,
          detectedLanguage: 'en' // Default to English for initial greeting
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
    const vacancyData = await extractVacancyDataFromChat(chat);
    
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

    // Detect language from the conversation for the completion message
    const conversationText = chat.messages.map(m => m.content).join(' ');
    const detectedLanguage = detectLanguage(conversationText);
    
    // Update chat with vacancy reference and completion status
    chat.vacancy = vacancy._id;
    chat.status = 'vacancy_creation_completed';
    chat.vacancyData = vacancyData;
    
    chat.messages.push({
      role: 'assistant',
      content: getVacancyCreationPrompt(detectedLanguage, 'completion', vacancy.title),
      messageType: VACANCY_CREATION_MESSAGE_TYPES.VACANCY_CREATION_COMPLETE,
      metadata: {
        vacancyId: vacancy._id,
        vacancyTitle: vacancy.title,
        detectedLanguage
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
  
  // Detect the language of the user's message
  const detectedLanguage = detectLanguage(userMessage);
  console.log(`Vacancy Creation Chat - Detected language: ${detectedLanguage} for user message`);
  
  // Simple AI logic - in a real implementation, you'd use OpenAI or similar
  let response = '';
  let messageType = 'vacancy_creation_progress';
  let metadata = {};
  let step = '';

  // Analyze the conversation to determine what information we have
  const conversationText = messages.map(m => m.content).join(' ');
  
  if (conversationText.toLowerCase().includes('title') || 
      conversationText.toLowerCase().includes('position') ||
      conversationText.toLowerCase().includes('role')) {
    
    if (!conversationText.toLowerCase().includes('description') || 
        !conversationText.toLowerCase().includes('responsibilities')) {
      step = 'collecting_description';
    } else if (!conversationText.toLowerCase().includes('requirements') || 
               !conversationText.toLowerCase().includes('skills')) {
      step = 'collecting_requirements';
    } else if (!conversationText.toLowerCase().includes('salary') || 
               !conversationText.toLowerCase().includes('compensation')) {
      step = 'collecting_salary';
    } else if (!conversationText.toLowerCase().includes('location') || 
               !conversationText.toLowerCase().includes('remote')) {
      step = 'collecting_location';
    } else {
      step = 'ready_to_create';
      messageType = 'vacancy_ready';
    }
  } else {
    step = 'collecting_title';
  }

  // Get the appropriate response in the detected language
  response = getVacancyCreationPrompt(detectedLanguage, step);
  metadata.step = step;
  metadata.detectedLanguage = detectedLanguage;

  return {
    role: 'assistant',
    content: response,
    messageType,
    metadata
  };
}

// Helper function to extract vacancy data from chat
async function extractVacancyDataFromChat(chat) {
  const messages = chat.messages;
  const conversationText = messages.map(m => m.content).join(' ');
  
  // Get a default category (first available category)
  const defaultCategory = await Category.findOne();
  if (!defaultCategory) {
    throw new Error('No categories found. Please create categories first.');
  }

  // Get user's company if they have one
  const user = await User.findById(chat.candidate).populate('company');
  let userCompany = null;
  
  if (user && user.company) {
    userCompany = user.company;
  } else {
    // Find or create a default company for this user
    userCompany = await Company.findOne({ creator: chat.candidate });
    if (!userCompany) {
      userCompany = await Company.create({
        name: `${user.firstName} ${user.lastName}'s Company`,
        description: 'Default company',
        location: {
          country: 'Unknown',
          city: 'Unknown',
          address: 'Unknown'
        },
        creator: chat.candidate,
        employees: '1-10',
        industry: 'Technology',
        website: '',
        logo: ''
      });
    }
  }
  
  // Simple extraction logic - in a real implementation, you'd use NLP
  const vacancyData = {
    title: extractTitle(conversationText),
    description: extractDescription(conversationText),
    requirements: extractRequirements(conversationText),
    responsibilities: extractResponsibilities(conversationText),
    salary: extractSalary(conversationText),
    employmentType: 'full-time', // Default
    workType: 'remote', // Default (matches enum: 'remote', 'hybrid', 'on-site')
    location: {
      country: userCompany.location.country || 'Unknown',
      city: userCompany.location.city || 'Unknown',
      address: userCompany.location.address || 'Unknown',
      type: 'remote' // Required field for location
    },
    category: defaultCategory._id, // Use default category ObjectId
    company: userCompany._id, // Use user's company ObjectId
    skills: []
    // Note: subcategory is optional, so we don't set it
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