import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import type { UserProfile } from '../hooks/useUserProfile';
import LanguageSelector from './LanguageSelector';
import { getCurrentLanguageInfo } from '@/i18n/languageService';
import { logoutUser } from '@/features/auth/services/authService';

interface Props {
  profile?: UserProfile | null;
  savedCount: number;
}

const ProfileHeader: React.FC<Props> = ({ profile, savedCount }: Props) => {
  const { t } = useTranslation();
  const colors = useColors();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const currentLanguage = getCurrentLanguageInfo();

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.logoutButton, { backgroundColor: colors.secondary }]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.textLight} />
      </Pressable>

      <Pressable 
        style={[styles.languageButton, { backgroundColor: colors.primary }]} 
        onPress={() => setShowLanguageSelector(true)}
      >
        <Ionicons name="globe-outline" size={18} color={colors.background} style={styles.languageIcon} />
        <Text style={[styles.languageButtonText, { color: colors.background }]}>
          {currentLanguage?.nativeName || 'English'}
        </Text>
      </Pressable>

      <Image style={[styles.avatar, { backgroundColor: colors.secondary }]} source={require('@assets/user.jpg')} />
      <Text style={[styles.username, { color: colors.primary }]}>{profile?.username || profile?.name || t('profile.anonymous')}</Text>
      <Text style={[styles.name, { color: colors.textLight }]}>{profile?.name || t('profile.foodLover')}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{savedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.saved')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.posts')}</Text>
        </View>
      </View>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoutButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 10,
    borderRadius: 20,
  },
  languageButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  languageIcon: {
    marginRight: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  statLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});

export default ProfileHeader;
