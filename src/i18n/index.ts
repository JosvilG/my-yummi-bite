import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Only English is bundled - other languages are downloaded on demand
import en from './locales/en.json';

const resources = {
  en: { translation: en },
};

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';

// Always start with English - saved language will be loaded by initializeLanguage()
const getInitialLanguage = (): string => {
  // Start with English, the saved preference will be loaded after app init
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

/**
 * Change the current language
 */
export const changeLanguage = (lang: string): Promise<void> => {
  return i18n.changeLanguage(lang) as unknown as Promise<void>;
};

/**
 * Get the current language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * Get all supported languages
 */
export const getSupportedLanguages = (): string[] => {
  return Object.keys(i18n.options.resources || {});
};
