import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/app/config/firebase';
import i18n from './index';

// Storage keys
const LANGUAGE_KEY = '@MyYummiBite:language';
const CACHED_TRANSLATIONS_PREFIX = '@MyYummiBite:translations_';

// Built-in languages (always available, bundled with app)
import enTranslations from './locales/en.json';

// Available languages configuration
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

/**
 * Get the saved language preference from AsyncStorage
 */
export const getSavedLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.error('Error reading saved language:', error);
    return null;
  }
};

/**
 * Save language preference to AsyncStorage
 */
export const saveLanguagePreference = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving language preference:', error);
  }
};

/**
 * Get cached translations from AsyncStorage
 */
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

/**
 * Save translations to AsyncStorage cache
 */
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

/**
 * Download translations from Firebase Storage
 */
export const downloadTranslations = async (languageCode: string): Promise<Record<string, unknown>> => {
  try {
    // Reference to the language file in Firebase Storage
    const translationRef = ref(storage, `translations/${languageCode}.json`);
    const downloadUrl = await getDownloadURL(translationRef);
    
    // Fetch the translations
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download translations: ${response.status}`);
    }
    
    const translations = await response.json();
    return translations;
  } catch (error) {
    console.error(`Error downloading ${languageCode} translations:`, error);
    throw error;
  }
};

/**
 * Load translations for a language (from cache, download, or fallback)
 */
export const loadTranslations = async (languageCode: string): Promise<Record<string, unknown>> => {
  // English is always built-in as fallback
  if (languageCode === 'en') {
    return enTranslations;
  }

  // Check if we have cached translations
  const cached = await getCachedTranslations(languageCode);
  if (cached) {
    return cached;
  }

  // Download from Firebase Storage
  try {
    const translations = await downloadTranslations(languageCode);
    // Cache for offline use
    await cacheTranslations(languageCode, translations);
    return translations;
  } catch (error) {
    console.error(`Failed to load ${languageCode}, falling back to English:`, error);
    // Return English as fallback
    return enTranslations;
  }
};

/**
 * Change language with download support
 */
export const changeLanguageWithDownload = async (
  languageCode: string,
  onProgress?: (status: 'loading' | 'success' | 'error') => void
): Promise<boolean> => {
  try {
    onProgress?.('loading');

    // Load translations (from cache or download)
    const translations = await loadTranslations(languageCode);

    // Add resource to i18n if not already present
    if (!i18n.hasResourceBundle(languageCode, 'translation')) {
      i18n.addResourceBundle(languageCode, 'translation', translations, true, true);
    } else {
      // Update existing bundle
      i18n.addResourceBundle(languageCode, 'translation', translations, true, true);
    }

    // Change to the new language
    await i18n.changeLanguage(languageCode);

    // Persist the preference
    await saveLanguagePreference(languageCode);

    onProgress?.('success');
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    onProgress?.('error');
    
    // Fallback to English
    await i18n.changeLanguage('en');
    await saveLanguagePreference('en');
    return false;
  }
};

/**
 * Initialize language on app start
 * Loads saved preference or uses device language
 */
export const initializeLanguage = async (): Promise<void> => {
  try {
    // Check for saved preference
    const savedLanguage = await getSavedLanguage();
    
    if (savedLanguage) {
      // Load the saved language
      await changeLanguageWithDownload(savedLanguage);
    }
    // If no saved preference, keep the default (set during i18n init)
  } catch (error) {
    console.error('Error initializing language:', error);
    // Fallback to English on any error
    await i18n.changeLanguage('en');
  }
};

/**
 * Clear cached translations for a language
 */
export const clearCachedTranslations = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${CACHED_TRANSLATIONS_PREFIX}${languageCode}`);
  } catch (error) {
    console.error('Error clearing cached translations:', error);
  }
};

/**
 * Clear all cached translations
 */
export const clearAllCachedTranslations = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const translationKeys = keys.filter(key => key.startsWith(CACHED_TRANSLATIONS_PREFIX));
    await AsyncStorage.multiRemove(translationKeys);
  } catch (error) {
    console.error('Error clearing all cached translations:', error);
  }
};

/**
 * Check if a language has cached translations
 */
export const hasLanguageCached = async (languageCode: string): Promise<boolean> => {
  if (languageCode === 'en') return true; // English is always available
  const cached = await getCachedTranslations(languageCode);
  return cached !== null;
};

/**
 * Get current language info
 */
export const getCurrentLanguageInfo = (): LanguageConfig | undefined => {
  const currentCode = i18n.language;
  return AVAILABLE_LANGUAGES.find(lang => lang.code === currentCode);
};
