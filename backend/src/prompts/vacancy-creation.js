/**
 * Prompts for AI-powered vacancy creation assistance
 */

export const VACANCY_CREATION_INITIAL_PROMPT = `Hello! I'm here to help you create a vacancy. Please tell me about the position you want to create - what role are you hiring for, what are the main responsibilities, and any specific requirements you have in mind?

I'll guide you through the process step by step to create a comprehensive job posting.`;

export const VACANCY_CREATION_RESPONSES = {
  COLLECTING_TITLE: "I'd love to help you create a vacancy! Could you start by telling me what position you're hiring for?",
  
  COLLECTING_DESCRIPTION: "Great! Now can you tell me more about the job description and main responsibilities for this position?",
  
  COLLECTING_REQUIREMENTS: "Perfect! What are the key requirements and skills needed for this role?",
  
  COLLECTING_SALARY: "Excellent! What salary range are you offering for this position?",
  
  COLLECTING_LOCATION: "Almost done! What's the work location? Is this remote, hybrid, or on-site?",
  
  READY_TO_CREATE: "Perfect! I have all the information I need. Would you like me to create the vacancy now?"
};

export const VACANCY_CREATION_STEPS = {
  INITIAL_GREETING: 'initial_greeting',
  COLLECTING_TITLE: 'collecting_title',
  COLLECTING_DESCRIPTION: 'collecting_description',
  COLLECTING_REQUIREMENTS: 'collecting_requirements',
  COLLECTING_SALARY: 'collecting_salary',
  COLLECTING_LOCATION: 'collecting_location',
  READY_TO_CREATE: 'ready_to_create'
};

export const VACANCY_CREATION_MESSAGE_TYPES = {
  NORMAL: 'normal',
  VACANCY_CREATION_START: 'vacancy_creation_start',
  VACANCY_CREATION_PROGRESS: 'vacancy_creation_progress',
  VACANCY_READY: 'vacancy_ready',
  VACANCY_CREATION_COMPLETE: 'vacancy_creation_complete'
};

export const VACANCY_COMPLETION_MESSAGE = (vacancyTitle) => 
  `Great! I've created your vacancy "${vacancyTitle}". You can now review and publish it when you're ready.`;