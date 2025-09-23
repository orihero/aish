/**
 * Multilingual prompts for AI-powered vacancy creation assistance
 */

// Language-specific vacancy creation prompts
export const VACANCY_CREATION_PROMPTS = {
  en: {
    initial: `Hello! I'm here to help you create a vacancy. Please tell me about the position you want to create - what role are you hiring for, what are the main responsibilities, and any specific requirements you have in mind?

I'll guide you through the process step by step to create a comprehensive job posting.`,
    
    collecting_title: "I'd love to help you create a vacancy! Could you start by telling me what position you're hiring for?",
    
    collecting_description: "Great! Now can you tell me more about the job description and main responsibilities for this position?",
    
    collecting_requirements: "Perfect! What are the key requirements and skills needed for this role?",
    
    collecting_salary: "Excellent! What salary range are you offering for this position?",
    
    collecting_location: "Almost done! What's the work location? Is this remote, hybrid, or on-site?",
    
    ready_to_create: "Perfect! I have all the information I need. Would you like me to create the vacancy now?",
    
    completion: (vacancyTitle) => `Great! I've created your vacancy "${vacancyTitle}". You can now review and publish it when you're ready.`
  },

  ru: {
    initial: `Привет! Я здесь, чтобы помочь вам создать вакансию. Расскажите мне о позиции, которую вы хотите создать - какую роль вы ищете, какие основные обязанности и есть ли какие-то конкретные требования?

Я проведу вас через процесс пошагово, чтобы создать подробное объявление о вакансии.`,
    
    collecting_title: "Я буду рад помочь вам создать вакансию! Можете начать с того, что расскажете, какую позицию вы ищете?",
    
    collecting_description: "Отлично! Теперь расскажите мне больше о должностных обязанностях и основных задачах для этой позиции?",
    
    collecting_requirements: "Превосходно! Какие ключевые требования и навыки необходимы для этой роли?",
    
    collecting_salary: "Превосходно! Какой диапазон зарплаты вы предлагаете для этой позиции?",
    
    collecting_location: "Почти готово! Какое место работы? Это удаленная работа, гибридная или офисная?",
    
    ready_to_create: "Отлично! У меня есть вся необходимая информация. Хотите ли вы, чтобы я создал вакансию сейчас?",
    
    completion: (vacancyTitle) => `Отлично! Я создал вашу вакансию "${vacancyTitle}". Теперь вы можете просмотреть и опубликовать её, когда будете готовы.`
  },

  uk: {
    initial: `Привіт! Я тут, щоб допомогти вам створити вакансію. Розкажіть мені про позицію, яку ви хочете створити - яку роль ви шукаєте, які основні обов'язки і чи є якісь конкретні вимоги?

Я проведу вас через процес покроково, щоб створити детальну вакансію.`,
    
    collecting_title: "Я буду радий допомогти вам створити вакансію! Чи можете почати з того, що розкажете, яку позицію ви шукаєте?",
    
    collecting_description: "Чудово! Тепер розкажіть мені більше про посадові обов'язки та основні завдання для цієї позиції?",
    
    collecting_requirements: "Чудово! Які ключові вимоги та навички необхідні для цієї ролі?",
    
    collecting_salary: "Чудово! Який діапазон зарплати ви пропонуєте для цієї позиції?",
    
    collecting_location: "Майже готово! Яке місце роботи? Це віддалена робота, гібридна чи офісна?",
    
    ready_to_create: "Чудово! У мене є вся необхідна інформація. Чи хочете, щоб я створив вакансію зараз?",
    
    completion: (vacancyTitle) => `Чудово! Я створив вашу вакансію "${vacancyTitle}". Тепер ви можете переглянути та опублікувати її, коли будете готові.`
  },

  uz: {
    initial: `Salom! Men sizga vakansiya yaratishda yordam berish uchun shu yerdaman. Siz yaratmoqchi bo'lgan pozitsiya haqida menga ayting - qanday rol qidiryapsiz, asosiy majburiyatlar qanday va qandaydir aniq talablar bormi?

Men sizni batafsil ish joyi e'lonini yaratish uchun bosqichma-bosqich jarayon orqali o'tkazaman.`,
    
    collecting_title: "Men sizga vakansiya yaratishda yordam berishdan xursand bo'laman! Qanday pozitsiya qidiryapsiz, aytib bera olasizmi?",
    
    collecting_description: "Ajoyib! Endi menga bu pozitsiya uchun ish tavsifi va asosiy mas'uliyatlar haqida ko'proq gapirib bering?",
    
    collecting_requirements: "Ajoyib! Bu rol uchun qanday asosiy talablar va ko'nikmalar kerak?",
    
    collecting_salary: "Ajoyib! Bu pozitsiya uchun qanday maosh diapazonini taklif qilyapsiz?",
    
    collecting_location: "Deyarli tayyor! Ish joyi qanday? Bu uzoq masofadan, aralash yoki ofisdami?",
    
    ready_to_create: "Ajoyib! Menda barcha kerakli ma'lumotlar bor. Vakansiyani hozir yaratishni xohlaysizmi?",
    
    completion: (vacancyTitle) => `Ajoyib! Men sizning "${vacancyTitle}" vakansiyangizni yaratdim. Endi uni ko'rib chiqib, tayyor bo'lganda nashr qilishingiz mumkin.`
  }
};

/**
 * Get the appropriate prompt based on language and step
 * @param {string} languageCode - The language code (en, ru, uk, uz)
 * @param {string} step - The step in the conversation
 * @param {string} vacancyTitle - Optional vacancy title for completion message
 * @returns {string} - The appropriate prompt in the specified language
 */
export function getVacancyCreationPrompt(languageCode, step, vacancyTitle = null) {
  const prompts = VACANCY_CREATION_PROMPTS[languageCode] || VACANCY_CREATION_PROMPTS.en;
  
  switch (step) {
    case 'initial':
      return prompts.initial;
    case 'collecting_title':
      return prompts.collecting_title;
    case 'collecting_description':
      return prompts.collecting_description;
    case 'collecting_requirements':
      return prompts.collecting_requirements;
    case 'collecting_salary':
      return prompts.collecting_salary;
    case 'collecting_location':
      return prompts.collecting_location;
    case 'ready_to_create':
      return prompts.ready_to_create;
    case 'completion':
      return prompts.completion(vacancyTitle);
    default:
      return prompts.collecting_title;
  }
}
