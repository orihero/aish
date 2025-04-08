import { create } from 'zustand';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageState {
  currentLanguage: Language;
  languages: Language[];
  setLanguage: (code: string) => void;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' }
];

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: languages[0], // Default to English
  languages,
  setLanguage: (code) => {
    const language = languages.find(lang => lang.code === code);
    if (language) {
      localStorage.setItem('language', code);
      set({ currentLanguage: language });
    }
  }
}));