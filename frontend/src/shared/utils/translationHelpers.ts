import { translationType } from '../../types';

/**
 * Get translated value from translation array based on current language
 * @param translations - Array of translation objects
 * @param currentLang - Current selected language
 * @param fallbackLang - Fallback language (default: 'en')
 * @returns Translated value or fallback
 */
export const getTranslatedValue = (
    translations: translationType[],
    currentLang: string,
    fallbackLang: string = 'en'
): string => {
    if (!translations || !Array.isArray(translations)) return '';
    
    // Try to find translation for current language
    const currentTranslation = translations.find(t => t.language === currentLang);
    if (currentTranslation) return currentTranslation.value;
    
    // Fallback to fallback language
    const fallbackTranslation = translations.find(t => t.language === fallbackLang);
    if (fallbackTranslation) return fallbackTranslation.value;
    
    // If no translation found, return first available or empty string
    return translations[0]?.value || '';
};

/**
 * Get translated employment type
 * @param employmentType - Employment type key (e.g., 'full-time')
 * @param currentLang - Current selected language
 * @returns Translated employment type
 */
export const getTranslatedEmploymentType = (employmentType: string, currentLang: string): string => {
    const employmentTypeTranslations: Record<string, Record<string, string>> = {
        'full-time': {
            en: 'Full Time',
            ru: 'Полная занятость',
            uz: 'To\'liq ish',
        },
        'part-time': {
            en: 'Part Time',
            ru: 'Частичная занятость',
            uz: 'Qisman ish',
        },
        'contract': {
            en: 'Contract',
            ru: 'Контракт',
            uz: 'Shartnoma',
        },
        'internship': {
            en: 'Internship',
            ru: 'Стажировка',
            uz: 'Stajirovka',
        }
    };
    
    return employmentTypeTranslations[employmentType]?.[currentLang] || 
           employmentTypeTranslations[employmentType]?.['en'] || 
           employmentType;
};

/**
 * Get translated work type
 * @param workType - Work type key (e.g., 'remote')
 * @param currentLang - Current selected language
 * @returns Translated work type
 */
export const getTranslatedWorkType = (workType: string, currentLang: string): string => {
    const workTypeTranslations: Record<string, Record<string, string>> = {
        'remote': {
            en: 'Remote',
            ru: 'Удаленно',
            uz: 'Masofaviy',
        },
        'hybrid': {
            en: 'Hybrid',
            ru: 'Гибридный',
            uz: 'Aralash',
        },
        'on-site': {
            en: 'Onsite',
            ru: 'В офисе',
            uz: 'Ofisda',
        },
        'onsite': { // Handle both 'on-site' and 'onsite' variations
            en: 'Onsite',
            ru: 'В офисе',
            uz: 'Ofisda',
        }
    };
    
    return workTypeTranslations[workType]?.[currentLang] || 
           workTypeTranslations[workType]?.['en'] || 
           workType;
};

/**
 * Get translated experience level
 * @param level - Experience level key (e.g., 'basic')
 * @param currentLang - Current selected language
 * @returns Translated experience level
 */
export const getTranslatedExperienceLevel = (level: string, currentLang: string): string => {
    const levelTranslations: Record<string, Record<string, string>> = {
        'basic': {
            en: 'Basic',
            ru: 'Базовый',
            uz: 'Asosiy',
        },
        'intermediate': {
            en: 'Intermediate',
            ru: 'Средний',
            uz: 'O\'rta',
        },
        'fluent': {
            en: 'Fluent',
            ru: 'Свободно',
            uz: 'Erkin',
        },
        'native': {
            en: 'Native',
            ru: 'Родной',
            uz: 'Ona tili',
        }
    };
    
    return levelTranslations[level]?.[currentLang] || 
           levelTranslations[level]?.['en'] || 
           level;
};
