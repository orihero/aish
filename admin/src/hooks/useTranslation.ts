import { useTranslationsStore } from '../stores/translations.store';
import { useLanguageStore } from '../stores/language.store';

export function useTranslation() {
  const { t } = useTranslationsStore();
  const { currentLanguage, languages, setLanguage } = useLanguageStore();

  return {
    t,
    currentLanguage,
    languages,
    setLanguage
  };
}