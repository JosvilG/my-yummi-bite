import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { useTheme, ThemeMode } from '@/app/providers/ThemeProvider';
import { useColors } from '@/shared/hooks/useColors';
import { FONTS } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  mode: ThemeMode;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { mode: 'light', icon: 'sunny', labelKey: 'profile.themeLight' },
  { mode: 'dark', icon: 'moon', labelKey: 'profile.themeDark' },
  { mode: 'auto', icon: 'phone-portrait-outline', labelKey: 'profile.themeAuto' },
];

const ThemeSelector: React.FC<Props> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  const colors = useColors();

  const handleThemeSelect = async (mode: ThemeMode) => {
    await setThemeMode(mode);
    onClose();
  };

  const renderThemeOption = (option: ThemeOption) => {
    const isSelected = themeMode === option.mode;

    return (
      <AnimatedPressable
        key={option.mode}
        style={[
          styles.themeItem,
          { backgroundColor: isSelected ? colors.primary : colors.tertiary },
        ]}
        onPress={() => handleThemeSelect(option.mode)}
        scaleValue={0.96}
      >
        <View style={styles.themeItemContent}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.background },
          ]}>
            <Ionicons
              name={option.icon}
              size={24}
              color={isSelected ? colors.background : colors.primary}
            />
          </View>
          <Text style={[
            styles.themeText,
            { color: isSelected ? colors.background : colors.text },
          ]}>
            {t(option.labelKey)}
          </Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={colors.background} />
          )}
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <View style={[styles.headerIconContainer, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="color-palette-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{t('profile.selectTheme')}</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>{t('profile.themeHint')}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {THEME_OPTIONS.map(renderThemeOption)}
          </View>

          <AnimatedPressable
            style={styles.closeButton}
            onPress={onClose}
            scaleValue={0.96}
          >
            <Text style={[styles.closeButtonText, { color: colors.textLight }]}>{t('common.close')}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  themeItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  themeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
});

export default ThemeSelector;
