# Language Detection for AI Content Generation

This document explains how the language detection feature works in the AI content generation system.

## Overview

The system now automatically detects the language of input text and generates AI content in the same language. This ensures that when users enter job descriptions in languages like Russian, Ukrainian, Uzbek, Arabic, Chinese, Korean, or Japanese, all generated content (titles, requirements, responsibilities, salary ranges) will be in the same language.

## Supported Languages

- **English (en)** - Default language
- **Russian (ru)** - Русский
- **Ukrainian (uk)** - Українська  
- **Uzbek (uz)** - O'zbekcha
- **Arabic (ar)** - العربية
- **Chinese (zh)** - 中文
- **Korean (ko)** - 한국어
- **Japanese (ja)** - 日本語

## How It Works

### 1. Language Detection
The system uses pattern matching to detect the primary language of input text:
- **Cyrillic Script**: Detects Ukrainian-specific characters first (і, ї, є, ґ), then Russian
- **Arabic Script**: Detects Arabic characters
- **Japanese Script**: Detects hiragana/katakana characters
- **Korean Script**: Detects hangul characters  
- **Chinese Script**: Detects CJK unified ideographs
- **Latin Script**: Defaults to English

### 2. AI Prompt Enhancement
When generating content, the system:
1. Detects the language of the input description
2. Adds language-specific instructions to AI prompts
3. Generates content in the detected language
4. Returns both content and language metadata

### 3. Frontend Integration
The frontend components now:
- Receive language detection metadata from the API
- Log detected language information for debugging
- Handle the new response format with language information

## API Changes

### AI Content Generation Endpoint
**Endpoint**: `POST /ai/generate-content`

**Request**:
```json
{
  "description": "Job description text",
  "contentType": "title|requirements|responsibilities|salary",
  "currency": "USD" // optional
}
```

**Response**:
```json
{
  "success": true,
  "content": "Generated content",
  "detectedLanguage": "ru",
  "languageName": "Русский"
}
```

## Usage Examples

### Russian Job Description
**Input**: "Мы ищем разработчика с опытом работы в React"
**Generated Title**: "Разработчик React"
**Generated Requirements**: ["Опыт работы с React", "Знание JavaScript", ...]

### Ukrainian Job Description  
**Input**: "Ми шукаємо розробника з досвідом роботи в React"
**Generated Title**: "Розробник React"
**Generated Requirements**: ["Досвід роботи з React", "Знання JavaScript", ...]

### Arabic Job Description
**Input**: "نحن نبحث عن مطور مع خبرة في React"
**Generated Title**: "مطور React"
**Generated Requirements**: ["خبرة في React", "معرفة JavaScript", ...]

## Files Modified

### Backend
- `src/utils/languageDetection.js` - Language detection utility
- `src/controllers/ai.controller.js` - Updated to use language detection
- `src/controllers/chat.controller.js` - Updated vacancy creation chat
- `src/prompts/vacancy-creation-multilingual.js` - Multilingual prompts

### Frontend
- `admin/src/stores/chat.store.ts` - Updated to handle language metadata
- `admin/src/components/VacancyForm.tsx` - Updated AI generation functions
- `admin/src/pages/Jobs/pages/CreateJob.tsx` - Updated AI generation functions

## Testing

The language detection system has been tested with various languages and edge cases:
- ✅ All 8 supported languages correctly detected
- ✅ Edge cases handled (empty strings, special characters, mixed languages)
- ✅ AI prompts correctly enhanced with language instructions

## Benefits

1. **Improved User Experience**: Users can create job postings in their native language
2. **Consistent Language**: All generated content maintains the same language as input
3. **Automatic Detection**: No manual language selection required
4. **Multilingual Support**: Supports 8 major languages with room for expansion
5. **Backward Compatibility**: English remains the default for unrecognized text
