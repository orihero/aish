/**
 * Language detection utility for AI content generation
 */

/**
 * Detect the primary language of a given text
 * Uses simple heuristics to detect common languages
 * @param {string} text - The text to analyze
 * @returns {string} - Language code (en, ru, uk, uz, etc.)
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return 'en'; // Default to English
  }

  const cleanText = text.trim();
  if (cleanText.length === 0) {
    return 'en';
  }

  // Ukrainian language detection (check for Ukrainian-specific characters first)
  const ukrainianSpecificPattern = /[іїєґ]/i;
  if (ukrainianSpecificPattern.test(cleanText)) {
    return 'uk';
  }

  // Russian language detection
  const russianPattern = /[а-яё]/i;
  if (russianPattern.test(cleanText)) {
    return 'ru';
  }

  // Uzbek language detection (Cyrillic)
  const uzbekCyrillicPattern = /[а-яўқғҳ]/i;
  if (uzbekCyrillicPattern.test(cleanText)) {
    return 'uz';
  }

  // Uzbek language detection (Latin)
  const uzbekLatinPattern = /[a-z'ʻ]/i;
  if (uzbekLatinPattern.test(cleanText) && !/[а-я]/i.test(cleanText)) {
    // Check for Uzbek-specific Latin characters
    const uzbekSpecificChars = /['ʻ]/;
    if (uzbekSpecificChars.test(cleanText)) {
      return 'uz';
    }
  }

  // Arabic language detection
  const arabicPattern = /[\u0600-\u06FF]/;
  if (arabicPattern.test(cleanText)) {
    return 'ar';
  }

  // Japanese language detection (check for hiragana/katakana first)
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (japanesePattern.test(cleanText)) {
    return 'ja';
  }

  // Korean language detection
  const koreanPattern = /[\uac00-\ud7af]/;
  if (koreanPattern.test(cleanText)) {
    return 'ko';
  }

  // Chinese language detection (after Japanese and Korean)
  const chinesePattern = /[\u4e00-\u9fff]/;
  if (chinesePattern.test(cleanText)) {
    return 'zh';
  }

  // Default to English for Latin script
  return 'en';
}

/**
 * Get language-specific instructions for AI prompts
 * @param {string} languageCode - The detected language code
 * @returns {string} - Language-specific instruction
 */
export function getLanguageInstruction(languageCode) {
  const languageInstructions = {
    'en': 'Please respond in English.',
    'ru': 'Пожалуйста, отвечайте на русском языке.',
    'uk': 'Будь ласка, відповідайте українською мовою.',
    'uz': 'Iltimos, o\'zbek tilida javob bering.',
    'ar': 'يرجى الرد باللغة العربية.',
    'zh': '请用中文回答。',
    'ko': '한국어로 답변해 주세요.',
    'ja': '日本語でお答えください。'
  };

  return languageInstructions[languageCode] || languageInstructions['en'];
}

/**
 * Get language name for display purposes
 * @param {string} languageCode - The language code
 * @returns {string} - Human-readable language name
 */
export function getLanguageName(languageCode) {
  const languageNames = {
    'en': 'English',
    'ru': 'Русский',
    'uk': 'Українська',
    'uz': "O'zbekcha",
    'ar': 'العربية',
    'zh': '中文',
    'ko': '한국어',
    'ja': '日本語'
  };

  return languageNames[languageCode] || 'English';
}
