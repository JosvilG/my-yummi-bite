import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';

const resources = {
  en: { translation: en },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';

const getInitialLanguage = (): string => {
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

export const changeLanguage = (lang: string): Promise<void> => {
  return i18n.changeLanguage(lang) as unknown as Promise<void>;
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const getSupportedLanguages = (): string[] => {
  return Object.keys(i18n.options.resources || {});
};
