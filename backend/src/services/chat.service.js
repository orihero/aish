import axios from 'axios';
import { Chat } from '../models/chat.model.js';

export async function startScreeningChat(application, vacancy, resume) {
  try {
    // Create initial chat
    const chat = new Chat({
      application: application._id,
      vacancy: vacancy._id,
      candidate: resume.user,
      messages: [
        {
          role: 'system',
          content: `You are an AI recruiter conducting an initial screening interview for a ${vacancy.title} position. 
          Review the candidate's resume and the job requirements, then ask relevant questions to assess their fit.
          
          Job Requirements:
          ${vacancy.description}
          
          Candidate Resume:
          ${JSON.stringify(resume.parsedData, null, 2)}
          
          Conduct a professional and friendly interview. Ask one question at a time and wait for the candidate's response.
          Focus on technical skills, experience, and behavioral questions relevant to the role.`
        },
        {
          role: 'assistant',
          content: `Hello! I'm the AI recruiter for the ${vacancy.title} position at our company. 
          I've reviewed your resume and I'd like to ask you a few questions to better understand your background and experience.
          
          Let's start with: Could you tell me about your most relevant experience for this role?`
        }
      ]
    });

    await chat.save();
    return chat;
  } catch (error) {
    console.error('Error starting screening chat:', error);
    throw error;
  }
}

export async function continueChat(chatId, message) {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error('Chat not found');

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message
    });

    // Get AI response
    const response = await axios.post(process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions', {
      model: process.env.OPENROUTER_CHAT_MODEL || 'meta-llama/llama-4-maverick:free',
      messages: chat.messages,
      temperature: parseFloat(process.env.OPENROUTER_CHAT_TEMPERATURE || '0.7')
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL,
        'X-Title': 'Job Application Chat'
      }
    });

    // Add AI response
    const aiMessage = {
      role: 'assistant',
      content: response.data.choices[0].message.content
    };
    chat.messages.push(aiMessage);

    // Check if screening should end
    if (chat.messages.length >= 10) { // After 5 exchanges
      await evaluateCandidate(chat);
    }

    await chat.save();
    return chat;
  } catch (error) {
    console.error('Error continuing chat:', error);
    throw error;
  }
}

async function evaluateCandidate(chat) {
  try {
    const response = await axios.post(process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions', {
      model: process.env.OPENROUTER_EVAL_MODEL || 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'system',
          content: 'You are an AI recruiter evaluating a candidate based on their interview responses. Provide a score from 0-100 and detailed feedback.'
        },
        {
          role: 'user',
          content: `Please evaluate this interview transcript and provide a score and feedback:
          ${JSON.stringify(chat.messages, null, 2)}`
        }
      ],
      temperature: parseFloat(process.env.OPENROUTER_EVAL_TEMPERATURE || '0.3')
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL,
        'X-Title': 'Candidate Evaluation'
      }
    });

    const evaluation = JSON.parse(response.data.choices[0].message.content);
    
    chat.status = 'completed';
    chat.score = evaluation.score;
    chat.feedback = evaluation.feedback;
    
    await chat.save();
  } catch (error) {
    console.error('Error evaluating candidate:', error);
    throw error;
  }
}