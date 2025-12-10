import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS } from '@/constants/theme';
import {
  AVAILABLE_LANGUAGES,
  changeLanguageWithDownload,
  hasLanguageCached,
  type LanguageConfig,
} from '@/i18n/languageService';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

const LanguageSelector: React.FC<Props> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('idle');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [cachedLanguages, setCachedLanguages] = useState<Record<string, boolean>>({});

  // Check which languages are cached
  useEffect(() => {
    const checkCachedLanguages = async () => {
      const cached: Record<string, boolean> = {};
      for (const lang of AVAILABLE_LANGUAGES) {
        cached[lang.code] = await hasLanguageCached(lang.code);
      }
      setCachedLanguages(cached);
    };
    
    if (visible) {
      checkCachedLanguages();
    }
  }, [visible]);

  const handleLanguageSelect = useCallback(async (language: LanguageConfig) => {
    if (language.code === i18n.language) {
      onClose();
      return;
    }

    setSelectedLang(language.code);
    setLoadingStatus('loading');

    const success = await changeLanguageWithDownload(language.code, (status) => {
      if (status === 'loading') {
        setLoadingStatus('loading');
      } else if (status === 'success') {
        setLoadingStatus('success');
        // Update cached status
        setCachedLanguages(prev => ({ ...prev, [language.code]: true }));
        setTimeout(() => {
          setLoadingStatus('idle');
          setSelectedLang(null);
          onClose();
        }, 500);
      } else {
        setLoadingStatus('error');
        setTimeout(() => {
          setLoadingStatus('idle');
          setSelectedLang(null);
        }, 2000);
      }
    });

    if (!success) {
      setLoadingStatus('error');
    }
  }, [i18n.language, onClose]);

  const renderLanguageItem = (language: LanguageConfig) => {
    const isCurrentLanguage = i18n.language === language.code;
    const isLoading = loadingStatus === 'loading' && selectedLang === language.code;
    const isCached = cachedLanguages[language.code];

    return (
      <Pressable
        key={language.code}
        style={[
          styles.languageItem,
          isCurrentLanguage && styles.languageItemActive,
        ]}
        onPress={() => handleLanguageSelect(language)}
        disabled={loadingStatus === 'loading'}
      >
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, isCurrentLanguage && styles.languageNameActive]}>
            {language.nativeName}
          </Text>
          <Text style={styles.languageNameSecondary}>
            {language.name}
          </Text>
        </View>
        
        <View style={styles.languageStatus}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              {isCurrentLanguage && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.selectLanguage')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {loadingStatus === 'error' && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{t('profile.languageDownloadError')}</Text>
            </View>
          )}

          <View style={styles.languageList}>
            {AVAILABLE_LANGUAGES.map(renderLanguageItem)}
          </View>

          <Text style={styles.hint}>{t('profile.languageHint')}</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: FONTS.medium,
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  languageList: {
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.secondary,
  },
  languageItemActive: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  languageNameActive: {
    color: COLORS.primary,
  },
  languageNameSecondary: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  languageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cachedBadge: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default LanguageSelector;
