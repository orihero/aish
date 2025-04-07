import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKey } from '../stores/translations.store';

interface TranslatedTextProps {
  textKey: TranslationKey;
  className?: string;
}

export function TranslatedText({ textKey, className }: TranslatedTextProps) {
  const { t } = useTranslation();
  return <span className={className}>{t(textKey)}</span>;
}