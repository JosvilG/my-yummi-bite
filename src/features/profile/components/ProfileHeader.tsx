import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '@/constants/theme';
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
      {/* Logout button */}
      <Pressable 
        style={styles.logoutButton} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.textLight} />
      </Pressable>

      {/* Language selector button */}
      <Pressable 
        style={styles.languageButton} 
        onPress={() => setShowLanguageSelector(true)}
      >
        <Ionicons name="globe-outline" size={18} color={COLORS.background} style={styles.languageIcon} />
        <Text style={styles.languageButtonText}>
          {currentLanguage?.nativeName || 'English'}
        </Text>
      </Pressable>

      <Image style={styles.avatar} source={require('@assets/user.jpg')} />
      <Text style={styles.username}>{profile?.username || profile?.name || t('profile.anonymous')}</Text>
      <Text style={styles.name}>{profile?.name || t('profile.foodLover')}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{savedCount}</Text>
          <Text style={styles.statLabel}>{t('profile.saved')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>{t('profile.posts')}</Text>
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
    backgroundColor: COLORS.secondary,
  },
  languageButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.background,
  },
  languageIcon: {
    marginRight: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    backgroundColor: COLORS.secondary,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.primary,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
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
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    fontSize: 12,
  },
});

export default ProfileHeader;
