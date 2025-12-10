import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/app/config/firebase';
import i18n from './index';
import { log } from '@/lib/logger';

const LANGUAGE_KEY = '@MyYummiBite:language';
const CACHED_TRANSLATIONS_PREFIX = '@MyYummiBite:translations_';

import enTranslations from './locales/en.json';

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  isBuiltIn: boolean;
}

export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', isBuiltIn: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isBuiltIn: false },
  { code: 'fr', name: 'French', nativeName: 'Français', isBuiltIn: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isBuiltIn: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isBuiltIn: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isBuiltIn: false },
];

export const getSavedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    log.error('Error reading saved language', error);
    return null;
  }
};

export const saveLanguagePreference = async (languageCode: string): Promise<void> => {
  try {
    log.info('Saving language preference', { languageCode });
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    log.error('Error saving language preference', error, { languageCode });
  }
};

export const getCachedTranslations = async (languageCode: string): Promise<Record<string, unknown> | null> => {
  try {
    const cached = await AsyncStorage.getItem(`${CACHED_TRANSLATIONS_PREFIX}${languageCode}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error('Error reading cached translations:', error);
    return null;
  }
};

export const cacheTranslations = async (languageCode: string, translations: Record<string, unknown>): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      `${CACHED_TRANSLATIONS_PREFIX}${languageCode}`,
      JSON.stringify(translations)
    );
  } catch (error) {
    console.error('Error caching translations:', error);
  }
};

export const downloadTranslations = async (languageCode: string): Promise<Record<string, unknown>> => {
  try {
    log.info('Downloading translations', { languageCode });
    const translationRef = ref(storage, `translations/${languageCode}.json`);
    const downloadUrl = await getDownloadURL(translationRef);
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download translations: ${response.status}`);
    }
    
    const translations = await response.json();
    log.info('Translations downloaded successfully', { languageCode });
    return translations;
  } catch (error) {
    log.error('Error downloading translations', error, { languageCode });
    throw error;
  }
};

export const loadTranslations = async (languageCode: string): Promise<Record<string, unknown>> => {
  if (languageCode === 'en') {
    return enTranslations;
  }

  const cached = await getCachedTranslations(languageCode);
  if (cached) {
    return cached;
  }

  try {
    const translations = await downloadTranslations(languageCode);
    await cacheTranslations(languageCode, translations);
    return translations;
  } catch (error) {
    console.error(`Failed to load ${languageCode}, falling back to English:`, error);
    return enTranslations;
  }
};

export const changeLanguageWithDownload = async (
  languageCode: string,
  onProgress?: (status: 'loading' | 'success' | 'error') => void
): Promise<boolean> => {
  try {
    log.info('Changing language', { languageCode });
    onProgress?.('loading');

    const translations = await loadTranslations(languageCode);

    if (!i18n.hasResourceBundle(languageCode, 'translation')) {
      i18n.addResourceBundle(languageCode, 'translation', translations, true, true);
    } else {
      i18n.addResourceBundle(languageCode, 'translation', translations, true, true);
    }

    await i18n.changeLanguage(languageCode);

    await saveLanguagePreference(languageCode);

    log.info('Language changed successfully', { languageCode });
    onProgress?.('success');
    return true;
  } catch (error) {
    log.error('Error changing language', error, { languageCode });
    onProgress?.('error');
    
    await i18n.changeLanguage('en');
    await saveLanguagePreference('en');
    return false;
  }
};

export const initializeLanguage = async (): Promise<void> => {
  try {
    const savedLanguage = await getSavedLanguage();
    
    if (savedLanguage) {
      await changeLanguageWithDownload(savedLanguage);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
    await i18n.changeLanguage('en');
  }
};

export const clearCachedTranslations = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${CACHED_TRANSLATIONS_PREFIX}${languageCode}`);
  } catch (error) {
    console.error('Error clearing cached translations:', error);
  }
};

export const clearAllCachedTranslations = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const translationKeys = keys.filter(key => key.startsWith(CACHED_TRANSLATIONS_PREFIX));
    await AsyncStorage.multiRemove(translationKeys);
  } catch (error) {
    console.error('Error clearing all cached translations:', error);
  }
};

export const hasLanguageCached = async (languageCode: string): Promise<boolean> => {
  if (languageCode === 'en') return true;
  const cached = await getCachedTranslations(languageCode);
  return cached !== null;
};

export const getCurrentLanguageInfo = (): LanguageConfig | undefined => {
  const currentCode = i18n.language;
  return AVAILABLE_LANGUAGES.find(lang => lang.code === currentCode);
};
