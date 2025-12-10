import React, { useState } from 'react';
import { 
  Dimensions,
  FlatList, 
  Image,
  Modal,
  ScrollView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/app/providers/AuthProvider';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useFavoriteRecipes } from '@/features/recipes/hooks/useFavoriteRecipes';
import ProfileSkeleton from '@/shared/components/ProfileSkeleton';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { useUserProfile } from '../hooks/useUserProfile';
import LanguageSelector from '../components/LanguageSelector';
import ThemeSelector from '../components/ThemeSelector';
import { useColors } from '@/shared/hooks/useColors';
import { getCurrentLanguageInfo } from '@/i18n/languageService';
import { logoutUser } from '@/features/auth/services/authService';
import { FONTS } from '@/constants/theme';
import type { MainStackParamList, TabParamList } from '@/types/navigation';
import { log } from '@/lib/logger';
import type { FavoriteRecipeDoc } from '@/features/recipes/services/favoriteService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<MainStackParamList>
>;

type TabType = 'saved' | 'published' | 'info';

const ProfileScreen: React.FC<ProfileScreenProps> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const colors = useColors();
  const { favorites, loading } = useFavoriteRecipes();
  const { profile } = useUserProfile(user?.uid);
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleRecipePress = (recipeId: number) => {
    log.info('Navigation to recipe details', { recipeId, from: 'ProfileScreen' });
    navigation.navigate('Info', { id: recipeId });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logoutUser();
  };

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const getThemeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (themeMode) {
      case 'light': return 'sunny';
      case 'dark': return 'moon';
      default: return 'phone-portrait-outline';
    }
  };

  const getThemeLabel = (): string => {
    switch (themeMode) {
      case 'light': return t('settings.lightMode');
      case 'dark': return t('settings.darkMode');
      default: return t('settings.autoMode');
    }
  };

  const renderRecipeCard = ({ item }: { item: FavoriteRecipeDoc }) => (
    <AnimatedPressable onPress={() => handleRecipePress(item.id)} style={styles.recipeCard} scaleValue={0.96}>
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: item.url }} style={styles.recipeImage} />
        <View style={[styles.heartBadge, { backgroundColor: colors.background }]}>
          <Ionicons name="heart" size={14} color={colors.primary} />
        </View>
      </View>
      <Text style={[styles.recipeTitle, { color: colors.text }]} numberOfLines={1}>
        {t('recipe.savedRecipe')}
      </Text>
    </AnimatedPressable>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.tertiary }]}>
        <AnimatedPressable style={styles.headerButton} onPress={handleLogout} scaleValue={0.85}>
          <Ionicons name="log-out-outline" size={24} color={colors.text} />
        </AnimatedPressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        <AnimatedPressable style={styles.headerButton} onPress={handleSettingsPress} scaleValue={0.85}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </AnimatedPressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileSection, { backgroundColor: colors.tertiary }]}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary, backgroundColor: colors.background }]}>
            <Image 
              style={styles.avatar} 
              source={require('@assets/user.jpg')} 
            />
          </View>
          
          <Text style={[styles.username, { color: colors.text }]}>
            {profile?.username || profile?.name || t('profile.anonymous')}
          </Text>
          
          <Text style={[styles.bio, { color: colors.textLight }]}>
            {profile?.bio || t('profile.defaultBio')}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>1.2k</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.followers')}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>450</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.following')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.tabsContainer, { backgroundColor: colors.tertiary }]}>
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'saved' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('saved')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="heart" 
              size={18} 
              color={activeTab === 'saved' ? colors.background : colors.textLight} 
            />
            <Text style={[styles.tabText, { color: activeTab === 'saved' ? colors.background : colors.textLight }]}>
              {t('profile.saved')}
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'published' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('published')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="restaurant-outline" 
              size={18} 
              color={activeTab === 'published' ? colors.background : colors.textLight} 
            />
            <Text style={[styles.tabText, { color: activeTab === 'published' ? colors.background : colors.textLight }]}>
              {t('profile.published')}
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'info' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('info')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={activeTab === 'info' ? colors.background : colors.textLight} 
            />
            <Text style={[styles.tabText, { color: activeTab === 'info' ? colors.background : colors.textLight }]}>
              {t('profile.info')}
            </Text>
          </AnimatedPressable>
        </View>

        {activeTab === 'saved' && (
          <View style={styles.recipesGrid}>
            {favorites.map((item) => (
              <AnimatedPressable 
                key={item.docId} 
                onPress={() => handleRecipePress(item.id)} 
                style={styles.recipeCard}
                scaleValue={0.96}
              >
                <View style={[styles.recipeImageContainer, { backgroundColor: colors.tertiary }]}>
                  <Image source={{ uri: item.url }} style={styles.recipeImage} />
                  <View style={[styles.heartBadge, { backgroundColor: colors.background }]}>
                    <Ionicons name="heart" size={14} color={colors.primary} />
                  </View>
                </View>
              </AnimatedPressable>
            ))}
          </View>
        )}

        {activeTab === 'published' && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>{t('profile.noPublished')}</Text>
          </View>
        )}

        {activeTab === 'info' && (
          <View style={styles.infoSection}>
            <View style={[styles.infoRow, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{user?.email || 'No email'}</Text>
            </View>
            <View style={[styles.infoRow, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{t('profile.memberSince')}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.settingsOverlay}>
          <View style={[styles.logoutModal, { backgroundColor: colors.background }]}>
            <View style={[styles.logoutIconContainer, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="log-out-outline" size={30} color={colors.primary} />
            </View>
            <Text style={[styles.logoutTitle, { color: colors.text }]}>{t('auth.logout')}</Text>
            <Text style={[styles.logoutDescription, { color: colors.textLight }]}>
              {t('profile.logoutConfirm')}
            </Text>

            <View style={styles.logoutActions}>
              <AnimatedPressable
                style={[styles.logoutActionButton, styles.logoutCancelButton, { borderColor: colors.border }]}
                onPress={closeLogoutModal}
                scaleValue={0.96}
              >
                <Text style={[styles.logoutCancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[
                  styles.logoutActionButton,
                  styles.logoutConfirmButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={confirmLogout}
                scaleValue={0.96}
              >
                <Text style={[styles.logoutConfirmText, { color: colors.background }]}>
                  {t('auth.logout')}
                </Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSettingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.settingsOverlay}>
          <View style={[styles.settingsModal, { backgroundColor: colors.background }]}>
            <View style={styles.settingsHeader}>
              <View style={[styles.settingsIconContainer, { backgroundColor: colors.tertiary }]}>
                <Ionicons name="settings-outline" size={32} color={colors.primary} />
              </View>
              <Text style={[styles.settingsTitle, { color: colors.text }]}>{t('settings.title')}</Text>
            </View>

            <View style={styles.settingsOptions}>
              <AnimatedPressable
                style={[styles.settingsOption, { backgroundColor: colors.tertiary }]}
                onPress={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => setShowLanguageSelector(true), 300);
                }}
                scaleValue={0.96}
              >
                <View style={styles.settingsOptionContent}>
                  <View style={[styles.settingsOptionIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="language" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.settingsOptionTextContainer}>
                    <Text style={[styles.settingsOptionTitle, { color: colors.text }]}>{t('settings.language')}</Text>
                    <Text style={[styles.settingsOptionValue, { color: colors.textLight }]}>
                      {getCurrentLanguageInfo()?.nativeName || 'English'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </View>
              </AnimatedPressable>

              <AnimatedPressable
                style={[styles.settingsOption, { backgroundColor: colors.tertiary }]}
                onPress={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => setShowThemeSelector(true), 300);
                }}
                scaleValue={0.96}
              >
                <View style={styles.settingsOptionContent}>
                  <View style={[styles.settingsOptionIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name={getThemeIcon()} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.settingsOptionTextContainer}>
                    <Text style={[styles.settingsOptionTitle, { color: colors.text }]}>{t('settings.appearance')}</Text>
                    <Text style={[styles.settingsOptionValue, { color: colors.textLight }]}>
                      {getThemeLabel()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                </View>
              </AnimatedPressable>
            </View>

            <AnimatedPressable
              style={styles.settingsCloseButton}
              onPress={() => setShowSettingsModal(false)}
              scaleValue={0.96}
            >
              <Text style={[styles.settingsCloseText, { color: colors.textLight }]}>{t('common.close')}</Text>
            </AnimatedPressable>
          </View>
        </View>
      </Modal>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: 18,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginTop: 12,
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
  },
  tabPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 22,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  recipeCard: {
    width: CARD_WIDTH,
  },
  recipeImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: 12,
  },
  infoSection: {
    padding: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
  },
  settingsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  settingsOptions: {
    gap: 12,
  },
  settingsOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  settingsOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOptionTextContainer: {
    flex: 1,
  },
  settingsOptionTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
  settingsOptionValue: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 2,
  },
  settingsCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  settingsCloseText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  logoutModal: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 8,
  },
  logoutDescription: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  logoutActionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelButton: {
    borderWidth: 1,
  },
  logoutConfirmButton: {
    borderWidth: 0,
  },
  logoutCancelText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  logoutConfirmText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

export default ProfileScreen;
