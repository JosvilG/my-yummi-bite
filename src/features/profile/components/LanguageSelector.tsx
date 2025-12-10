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
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
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
  const colors = useColors();
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
          { backgroundColor: colors.secondary },
          isCurrentLanguage && { 
            backgroundColor: colors.primary + '15',
            borderWidth: 1,
            borderColor: colors.primary,
          },
        ]}
        onPress={() => handleLanguageSelect(language)}
        disabled={loadingStatus === 'loading'}
      >
        <View style={styles.languageInfo}>
          <Text style={[
            styles.languageName, 
            { color: colors.text },
            isCurrentLanguage && { color: colors.primary }
          ]}>
            {language.nativeName}
          </Text>
          <Text style={[styles.languageNameSecondary, { color: colors.textLight }]}>
            {language.name}
          </Text>
        </View>
        
        <View style={styles.languageStatus}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              {isCurrentLanguage && (
                <View style={[styles.checkmark, { backgroundColor: colors.background, borderColor: colors.primary }]}>
                  <Text style={[styles.checkmarkText, { color: colors.primary }]}>✓</Text>
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
        <View style={[styles.container, { backgroundColor: colors.background }]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>{t('profile.selectLanguage')}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.textLight }]}>✕</Text>
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

          <Text style={[styles.hint, { color: colors.textLight }]}>{t('profile.languageHint')}</Text>
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
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
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
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  languageNameSecondary: {
    fontFamily: FONTS.regular,
    fontSize: 13,
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
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  hint: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LanguageSelector;
