import React, { useEffect, useState } from 'react';
import { 
  Dimensions,
  FlatList, 
  Image,
  Modal,
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput,
  View 
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
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
import type { ProfileStackParamList } from '@/types/navigation';
import { log } from '@/lib/logger';
import type { FavoriteRecipeDoc } from '@/features/recipes/services/favoriteService';
import { subscribeToPublishedRecipesByAuthor, type PublishedRecipeDoc } from '@/features/social/services/publishedRecipeService';
import ProfileDashboardSkeleton from '../components/ProfileDashboardSkeleton';
import ProfilePublishedGridSkeleton from '../components/ProfilePublishedGridSkeleton';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import CameraView from '@/features/recipes/components/CameraView';
import { updateUserProfile } from '../services/profileService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteUserAccountKeepRecipes, pauseUserAccount } from '../services/accountService';
import { EmailAuthProvider, deleteUser, reauthenticateWithCredential } from 'firebase/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

type ProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

type TabType = 'saved' | 'published' | 'info';

const ProfileScreen: React.FC<ProfileScreenProps> = observer(({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themeMode } = useTheme();
  const colors = useColors();
  const { showInfo, showConfirm, modal: infoModal } = useAppAlertModal();
  const { favorites, loading } = useFavoriteRecipes();
  const { profile } = useUserProfile(user?.uid);
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [publishedByMe, setPublishedByMe] = useState<PublishedRecipeDoc[]>([]);
  const [publishedByMeLoading, setPublishedByMeLoading] = useState(false);
  const [publishedByMeError, setPublishedByMeError] = useState<string | null>(null);
  const [publishedReloadNonce, setPublishedReloadNonce] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameDraft, setProfileNameDraft] = useState('');
  const [profileBioDraft, setProfileBioDraft] = useState('');
  const [profilePhotoDraft, setProfilePhotoDraft] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [accountActionLoading, setAccountActionLoading] = useState(false);
  const [reauthModalVisible, setReauthModalVisible] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');

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

  useEffect(() => {
    if (!isEditingProfile) return;
    setProfileNameDraft(profile?.name ?? '');
    setProfileBioDraft(profile?.bio ?? '');
    setProfilePhotoDraft(null);
  }, [isEditingProfile, profile?.bio, profile?.name]);

  const handleStartEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfilePhotoDraft(null);
    setCameraVisible(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    const name = profileNameDraft.trim();
    const bio = profileBioDraft.trim();
    if (!name) {
      showInfo({ title: t('common.error'), message: t('auth.fillAllFields'), confirmText: t('common.close') });
      return;
    }

    setSavingProfile(true);
    const result = await updateUserProfile(user.uid, {
      name,
      bio,
      photoUrl: profilePhotoDraft ?? undefined,
    });
    setSavingProfile(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('common.unknownError'),
        confirmText: t('common.close'),
      });
      return;
    }

    setIsEditingProfile(false);
    setProfilePhotoDraft(null);
  };

  const handlePauseAccountPress = () => {
    if (!user?.uid) return;

    showConfirm({
      title: t('profile.pauseAccountTitle'),
      message: t('profile.pauseAccountMessage'),
      iconName: 'pause-circle-outline',
      confirmText: t('profile.pauseAccount'),
      cancelText: t('common.cancel'),
      confirmVariant: 'destructive',
      onConfirm: async () => {
        if (!user?.uid) return;
        setAccountActionLoading(true);
        const result = await pauseUserAccount(user.uid);
        setAccountActionLoading(false);

        if (!result.success) {
          showInfo({
            title: t('common.error'),
            message: result.error ?? t('common.unknownError'),
            confirmText: t('common.close'),
          });
          return;
        }

        await logoutUser();
      },
    });
  };

  const handleDeleteAccountPress = () => {
    if (!user) return;

    showConfirm({
      title: t('profile.deleteAccountTitle'),
      message: t('profile.deleteAccountMessage'),
      iconName: 'trash-outline',
      confirmText: t('profile.deleteAccount'),
      cancelText: t('common.cancel'),
      confirmVariant: 'destructive',
      onConfirm: () => {
        setReauthPassword('');
        setReauthModalVisible(true);
      },
    });
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user) return;
    if (!user.email) {
      showInfo({
        title: t('common.error'),
        message: t('profile.reauthNoEmail'),
        confirmText: t('common.close'),
      });
      return;
    }

    const hasPasswordProvider = user.providerData?.some(p => p.providerId === 'password');
    if (!hasPasswordProvider) {
      showInfo({
        title: t('common.error'),
        message: t('profile.reauthUnsupported'),
        confirmText: t('common.close'),
      });
      return;
    }

    const password = reauthPassword.trim();
    if (!password) {
      showInfo({
        title: t('common.error'),
        message: t('auth.fillAllFields'),
        confirmText: t('common.close'),
      });
      return;
    }

    setAccountActionLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      const cleanup = await deleteUserAccountKeepRecipes(user.uid);
      if (!cleanup.success) {
        showInfo({
          title: t('common.error'),
          message: cleanup.error ?? t('common.unknownError'),
          confirmText: t('common.close'),
        });
        return;
      }

      await deleteUser(user);
      setReauthModalVisible(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('common.unknownError');
      showInfo({
        title: t('common.error'),
        message,
        confirmText: t('common.close'),
      });
    } finally {
      setAccountActionLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.uid) {
      setPublishedByMe([]);
      setPublishedByMeLoading(false);
      setPublishedByMeError(null);
      return;
    }
    if (activeTab !== 'published' && activeTab !== 'saved') return;

    setPublishedByMeLoading(true);
    const unsubscribe = subscribeToPublishedRecipesByAuthor(
      user.uid,
      (result) => {
        if (!result.success) {
          setPublishedByMe([]);
          setPublishedByMeError(result.error ?? t('common.unknownError'));
          setPublishedByMeLoading(false);
          return;
        }

        setPublishedByMe(result.recipes ?? []);
        setPublishedByMeError(null);
        setPublishedByMeLoading(false);
      },
      50
    );

    return unsubscribe;
  }, [activeTab, publishedReloadNonce, t, user?.uid]);

  const publishedStats = React.useMemo(() => {
    const publishedCount = publishedByMe.length;
    const likes = publishedByMe.reduce((sum, r) => sum + (r.likesCount ?? 0), 0);
    const saves = publishedByMe.reduce((sum, r) => sum + (r.savesCount ?? 0), 0);
    const shares = publishedByMe.reduce((sum, r) => sum + (r.sharesCount ?? 0), 0);
    return { publishedCount, likes, saves, shares };
  }, [publishedByMe]);

  const handlePublishedPress = (publishedId: string) => {
    navigation.navigate('PublishedInfo', { id: publishedId });
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

  const avatarSource =
    profilePhotoDraft
      ? { uri: profilePhotoDraft }
      : profile?.photoUrl
        ? { uri: profile.photoUrl }
        : require('@assets/user.jpg');

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
          <AnimatedPressable
            style={[styles.avatarContainer, { borderColor: colors.primary, backgroundColor: colors.background }]}
            pressableStyle={styles.avatarContainerInner}
            onPress={() => {
              if (!isEditingProfile) return;
              setCameraVisible(true);
            }}
            scaleValue={0.98}
          >
            <Image style={styles.avatar} source={avatarSource as any} />
            {isEditingProfile && (
              <View style={[styles.avatarEditBadge, { backgroundColor: colors.background }]}>
                <Ionicons name="camera-outline" size={16} color={colors.primary} />
              </View>
            )}
          </AnimatedPressable>
          
          {isEditingProfile ? (
            <TextInput
              value={profileNameDraft}
              onChangeText={setProfileNameDraft}
              style={[styles.profileNameInput, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('auth.fullName')}
              placeholderTextColor={colors.textLight}
            />
          ) : (
            <Text style={[styles.username, { color: colors.text }]}>
              {profile?.name || profile?.username || t('profile.anonymous')}
            </Text>
          )}
          
          {isEditingProfile ? (
            <TextInput
              value={profileBioDraft}
              onChangeText={setProfileBioDraft}
              style={[styles.profileBioInput, { color: colors.text, borderColor: colors.border }]}
              placeholder={t('profile.defaultBio')}
              placeholderTextColor={colors.textLight}
              multiline
            />
          ) : (
            <Text style={[styles.bio, { color: colors.textLight }]}>
              {profile?.bio || t('profile.defaultBio')}
            </Text>
          )}

          {isEditingProfile ? (
            <View style={styles.editActionsRow}>
              <AnimatedPressable
                style={[styles.editActionButton, styles.editCancelButton, { borderColor: colors.border }]}
                onPress={handleCancelEditProfile}
                disabled={savingProfile}
                scaleValue={0.96}
              >
                <Text style={[styles.editCancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.editActionButton, styles.editSaveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveProfile}
                disabled={savingProfile}
                scaleValue={0.96}
              >
                <Text style={[styles.editSaveText, { color: colors.background }]}>{t('common.save')}</Text>
              </AnimatedPressable>
            </View>
          ) : (
            <AnimatedPressable
              style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
              onPress={handleStartEditProfile}
              scaleValue={0.96}
            >
              <View style={styles.editProfileContent}>
                <Ionicons name="create-outline" size={16} color={colors.background} />
                <Text style={[styles.editProfileText, { color: colors.background }]}>{t('profile.editProfile')}</Text>
              </View>
            </AnimatedPressable>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{profile?.followersCount ?? 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.followers')}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <AnimatedPressable
              style={styles.statItem}
              pressableStyle={styles.statItemPressable}
              onPress={() => navigation.navigate('FollowingList')}
              scaleValue={0.96}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>{profile?.followingCount ?? 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.following')}</Text>
            </AnimatedPressable>
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
          publishedByMeLoading ? (
            <ProfileDashboardSkeleton />
          ) : publishedByMeError ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>{publishedByMeError}</Text>
              <AnimatedPressable
                onPress={() => setPublishedReloadNonce(n => n + 1)}
                style={[styles.retryButton, { backgroundColor: colors.tertiary }]}
                scaleValue={0.96}
              >
                <Text style={[styles.retryText, { color: colors.text }]}>{t('common.retry')}</Text>
              </AnimatedPressable>
            </View>
          ) : (
            <View style={styles.dashboardContainer}>
              <View style={styles.dashboardHeader}>
                <Text style={[styles.dashboardTitle, { color: colors.text }]}>{t('profile.dashboardTitle')}</Text>
                <Text style={[styles.dashboardSubtitle, { color: colors.textLight }]}>{t('profile.dashboardSubtitle')}</Text>
              </View>

              <View style={styles.dashboardGrid}>
                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="restaurant-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{publishedStats.publishedCount}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statPublished')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="heart-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{publishedStats.saves}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statSaves')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="thumbs-up-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{publishedStats.likes}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statLikes')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{publishedStats.shares}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statShares')}</Text>
                </View>
              </View>
            </View>
          )
        )}

        {activeTab === 'published' && (
          publishedByMeLoading ? (
            <ProfilePublishedGridSkeleton />
          ) : publishedByMeError ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>{publishedByMeError}</Text>
              <AnimatedPressable
                onPress={() => setPublishedReloadNonce(n => n + 1)}
                style={[styles.retryButton, { backgroundColor: colors.tertiary }]}
                scaleValue={0.96}
              >
                <Text style={[styles.retryText, { color: colors.text }]}>{t('common.retry')}</Text>
              </AnimatedPressable>
            </View>
          ) : publishedByMe.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>{t('profile.noPublished')}</Text>
            </View>
          ) : (
            <View style={styles.recipesGrid}>
              {publishedByMe.map((item) => (
                <AnimatedPressable
                  key={item.id}
                  onPress={() => handlePublishedPress(item.id)}
                  style={styles.recipeCard}
                  scaleValue={0.96}
                >
                  <View style={[styles.recipeImageContainer, { backgroundColor: colors.tertiary }]}>
                    <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
                    <View style={[styles.heartBadge, { backgroundColor: colors.background }]}>
                      <Ionicons name="restaurant" size={14} color={colors.primary} />
                    </View>
                  </View>
                </AnimatedPressable>
              ))}
            </View>
          )
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

            <AnimatedPressable
              onPress={handlePauseAccountPress}
              disabled={accountActionLoading}
              scaleValue={0.98}
              pressableStyle={[styles.infoRow, { backgroundColor: colors.tertiary, opacity: accountActionLoading ? 0.6 : 1 }]}
            >
              <Ionicons name="pause-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{t('profile.pauseAccount')}</Text>
            </AnimatedPressable>

            <AnimatedPressable
              onPress={handleDeleteAccountPress}
              disabled={accountActionLoading}
              scaleValue={0.98}
              pressableStyle={[styles.infoRow, { backgroundColor: colors.tertiary, opacity: accountActionLoading ? 0.6 : 1 }]}
            >
              <Ionicons name="trash-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.primary }]}>{t('profile.deleteAccount')}</Text>
            </AnimatedPressable>
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

      <Modal visible={cameraVisible} animationType="slide" onRequestClose={() => setCameraVisible(false)}>
        <SafeAreaView style={[styles.cameraModal, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
          <View style={styles.cameraHeader}>
            <AnimatedPressable
              onPress={() => setCameraVisible(false)}
              style={styles.cameraCloseButton}
              pressableStyle={[styles.cameraCloseButtonInner, { backgroundColor: colors.tertiary }]}
              scaleValue={0.9}
            >
              <Ionicons name="close" size={26} color={colors.text} />
            </AnimatedPressable>
          </View>
          <View style={styles.cameraBody}>
            <CameraView
              onPhotoCaptured={(uri) => {
                setProfilePhotoDraft(uri);
                setCameraVisible(false);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={reauthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReauthModalVisible(false)}
      >
        <View style={styles.settingsOverlay}>
          <View style={[styles.logoutModal, { backgroundColor: colors.background }]}>
            <View style={[styles.logoutIconContainer, { backgroundColor: colors.tertiary }]}>
              <Ionicons name="shield-checkmark-outline" size={30} color={colors.primary} />
            </View>
            <Text style={[styles.logoutTitle, { color: colors.text }]}>{t('profile.reauthTitle')}</Text>
            <Text style={[styles.logoutDescription, { color: colors.textLight }]}>{t('profile.reauthMessage')}</Text>

            <TextInput
              value={reauthPassword}
              onChangeText={setReauthPassword}
              placeholder={t('auth.password')}
              placeholderTextColor={colors.textLight}
              secureTextEntry
              editable={!accountActionLoading}
              style={[styles.reauthInput, { color: colors.text, borderColor: colors.border }]}
            />

            <View style={styles.logoutActions}>
              <AnimatedPressable
                style={[styles.logoutActionButton, styles.logoutCancelButton, { borderColor: colors.border }]}
                onPress={() => setReauthModalVisible(false)}
                disabled={accountActionLoading}
                scaleValue={0.96}
              >
                <Text style={[styles.logoutCancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.logoutActionButton, { backgroundColor: colors.primary }]}
                onPress={handleConfirmDeleteAccount}
                disabled={accountActionLoading}
                scaleValue={0.96}
              >
                <Text style={[styles.logoutConfirmText, { color: colors.background }]}>{t('common.confirm')}</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>
      {infoModal}
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
  avatarContainerInner: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginTop: 12,
  },
  profileNameInput: {
    marginTop: 12,
    width: '80%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.bold,
    fontSize: 20,
    textAlign: 'center',
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  profileBioInput: {
    marginTop: 8,
    width: '85%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    minHeight: 64,
  },
  editProfileButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  editProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editProfileText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  editActionsRow: {
    flexDirection: 'row',
    width: '80%',
    gap: 12,
    marginTop: 14,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelButton: {
    borderWidth: 1,
  },
  editSaveButton: {},
  editCancelText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  editSaveText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
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
  statItemPressable: {
    alignItems: 'center',
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
  dashboardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  dashboardHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dashboardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  dashboardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 6,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  dashboardCard: {
    width: (SCREEN_WIDTH - 16 * 2 - 12) / 2,
    borderRadius: 16,
    padding: 14,
  },
  dashboardIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dashboardValue: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  },
  dashboardLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  infoSection: {
    padding: 24,
    gap: 16,
    paddingBottom: 120,
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
  reauthInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 18,
  },
  cameraModal: {
    flex: 1,
  },
  cameraHeader: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cameraCloseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBody: {
    flex: 1,
  },
});

export default ProfileScreen;
