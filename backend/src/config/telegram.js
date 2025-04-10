import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { User } from '../models/user.model.js';
import { Resume } from '../models/resume.model.js';
import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { Chat } from '../models/chat.model.js';
import { TelegramSubscription } from '../models/telegram-subscription.model.js';
import { analyzeResume } from '../services/resume-analyzer.service.js';
import { startScreeningChat, continueChat } from '../services/chat.service.js';

// Load environment variables
dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

// Store application state for users
const userStates = new Map();

// Store active chats for users
const activeChats = new Map();

// Create a bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
  baseApiUrl: 'https://api.telegram.org'
});

// Initialize bot with error handling
bot.on('error', (error) => {
  console.error('Telegram Bot Error:', error);
});

// Welcome message handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Job Board Bot! 👋\nI will notify you about new job postings and application updates.');
});

// Help message handler
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    'Available commands:\n' +
    '/start - Start the bot\n' +
    '/help - Show this help message\n' +
    '/subscribe - Subscribe to job notifications\n' +
    '/unsubscribe - Unsubscribe from notifications'
  );
});

// Subscription handlers
bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;
  // TODO: Save chat ID to database for notifications
  bot.sendMessage(chatId, '✅ You are now subscribed to job notifications!');
});

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;
  // TODO: Remove chat ID from database
  bot.sendMessage(chatId, '❌ You are now unsubscribed from notifications.');
});

// Notification functions
export const sendNewJobNotification = async (job) => {
  try {
    const company = await Company.findById(job.company);
    
    const message = 
      `🆕 New Job Posted!\n\n` +
      `Title: ${job.title}\n` +
      `Company: ${company.name}\n` +
      `Type: ${job.employmentType} - ${job.workType}\n` +
      `Salary: ${job.salary.currency} ${job.salary.min}-${job.salary.max}\n\n` +
      `Description:\n${job.description}\n\n` +
      `Apply using the button below! 👇`;

    const subscriptions = await TelegramSubscription.find({ 'preferences.jobAlerts': true });
    
    const keyboard = {
      inline_keyboard: [[
        { text: '📝 Apply Now', callback_data: `apply_${job._id}` }
      ]]
    };

    for (const subscription of subscriptions) {
      try {
        await bot.sendMessage(subscription.chatId, message, { 
          parse_mode: 'HTML',
          reply_markup: keyboard
        });
      } catch (error) {
        console.error(`Failed to send notification to ${subscription.chatId}:`, error);
      }
    }
  } catch (error) {
    console.error('Error sending job notification:', error);
  }
};

// Handle job application process
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  if (query.data.startsWith('apply_')) {
    const vacancyId = query.data.split('_')[1];
    
    try {
      const vacancy = await Vacancy.findById(vacancyId)
        .populate('company');
      
      if (!vacancy) {
        return bot.answerCallbackQuery(query.id, {
          text: '❌ This job is no longer available.',
          show_alert: true
        });
      }

      // Initialize application state
      userStates.set(chatId, {
        stage: 'contact',
        vacancy: vacancyId
      });

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, {
        chat_id: chatId,
        message_id: messageId
      });

      await bot.sendMessage(chatId,
        '👋 Great! Let\'s start your application.\n\n' +
        'First, please share your contact information by clicking the button below.',
        {
          reply_markup: {
            keyboard: [[{
              text: '📱 Share Contact',
              request_contact: true
            }]],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        }
      );
    } catch (error) {
      console.error('Error handling application:', error);
      bot.answerCallbackQuery(query.id, {
        text: '❌ An error occurred. Please try again.',
        show_alert: true
      });
    }
  }
});

// Handle contact sharing
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates.get(chatId);

  if (!state || state.stage !== 'contact') return;

  try {
    // Save or update user
    let user = await User.findOne({ phone: msg.contact.phone_number });
    
    if (!user) {
      user = await User.create({
        firstName: msg.contact.first_name,
        lastName: msg.contact.last_name || '',
        phone: msg.contact.phone_number,
        role: 'employee'
      });
    }

    // Update state
    state.user = user._id;
    state.stage = 'resume';
    userStates.set(chatId, state);

    await bot.sendMessage(chatId,
      '📄 Great! Now please send your CV/Resume as a PDF or DOC file.',
      {
        reply_markup: {
          remove_keyboard: true
        }
      }
    );
  } catch (error) {
    console.error('Error handling contact:', error);
    await bot.sendMessage(chatId, '❌ An error occurred. Please try again.');
    userStates.delete(chatId);
  }
});

// Handle document (CV/Resume) upload
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const state = userStates.get(chatId);

  if (!state || state.stage !== 'resume') return;

  try {
    const file = await bot.getFile(msg.document.file_id);
    const fileName = msg.document.file_name;
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    // Download and analyze the PDF
    const pdfResponse = await fetch(fileUrl);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfData = await pdf(Buffer.from(pdfBuffer));
    const parsedData = await analyzeResume(pdfData.text);

    // Create resume
    const resume = await Resume.create({
      user: state.user,
      name: `Resume for ${msg.from.first_name}`,
      cvFile: {
        url: fileUrl,
        filename: fileName
      },
      parsedData
    });

    // Get vacancy details for AI processing
    const vacancy = await Vacancy.findById(state.vacancy)
      .populate('company');

    resume.applications.push({
      vacancy: state.vacancy,
      appliedAt: new Date(),
      status: 'pending'
    });

    await resume.save();

    // Start screening chat
    const chat = await startScreeningChat(
      resume.applications[resume.applications.length - 1],
      vacancy,
      resume
    );

    // Store chat in active chats
    activeChats.set(chatId, chat._id);

    await bot.sendMessage(chatId,
      '✅ Thank you for your application!\n\n' +
      'I will now conduct a brief screening interview to learn more about your experience.\n\n' +
      chat.messages[chat.messages.length - 1].content,
      {
        reply_markup: {
          force_reply: true
        }
      }
    );

  } catch (error) {
    console.error('Error handling document:', error);
    await bot.sendMessage(chatId, '❌ An error occurred. Please try again.');
    userStates.delete(chatId);
    activeChats.delete(chatId);
  }
});

export const sendApplicationStatusNotification = async (application) => {
  try {
    const subscription = await TelegramSubscription.findOne({ userId: application.user });
    if (!subscription) return;

    const message = 
      `📝 Application Status Update!\n\n` +
      `Job: ${application.vacancy.title}\n` +
      `Status: ${application.status}\n\n` +
      `Check your dashboard for more details.`;

    await bot.sendMessage(subscription.chatId, message);
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

// Handle interview responses
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const activeChatId = activeChats.get(chatId);

  if (!activeChatId || msg.document) return; // Skip if no active chat or if it's a document

  try {
    const chat = await Chat.findById(activeChatId);
    if (!chat || chat.status !== 'screening') return;

    // Continue chat with user's message
    const updatedChat = await continueChat(chat._id, msg.text);

    // Send AI's response
    await bot.sendMessage(
      chatId,
      updatedChat.messages[updatedChat.messages.length - 1].content,
      {
        reply_markup: {
          force_reply: true
        }
      }
    );

    // If chat is completed, send feedback
    if (updatedChat.status === 'completed') {
      await bot.sendMessage(
        chatId,
        `🎯 Interview completed!\n\n` +
        `Score: ${updatedChat.score}/100\n\n` +
        `Feedback:\n${updatedChat.feedback}\n\n` +
        `We will review your application and get back to you soon.`
      );

      // Clear active chat
      activeChats.delete(chatId);
      userStates.delete(chatId);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await bot.sendMessage(
      chatId,
      '❌ An error occurred during the interview. Please try applying again.'
    );
    activeChats.delete(chatId);
    userStates.delete(chatId);
  }
});
export default bot;