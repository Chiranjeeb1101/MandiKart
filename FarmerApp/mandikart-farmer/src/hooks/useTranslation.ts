/**
 * MandiKart — useTranslation Hook
 */

import { useAppStore } from '@/store/appStore';
import { translations, TranslationSchema } from '@/i18n/translations';

export function useTranslation(): {
  t: TranslationSchema;
  language: string;
} {
  const language = useAppStore((state) => state.language);
  const currentTranslations = translations[language] || translations.en;

  return {
    t: currentTranslations,
    language,
  };
}
