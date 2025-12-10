import React, { useState } from 'react';
import { 
  Alert,
  Dimensions,
  FlatList, 
  Image, 
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
import { useFavoriteRecipes } from '@/features/recipes/hooks/useFavoriteRecipes';
import ProfileSkeleton from '@/shared/components/ProfileSkeleton';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { useUserProfile } from '../hooks/useUserProfile';
import LanguageSelector from '../components/LanguageSelector';
import { getCurrentLanguageInfo } from '@/i18n/languageService';
import { logoutUser } from '@/features/auth/services/authService';
import { COLORS, FONTS } from '@/constants/theme';
import type { MainStackParamList, TabParamList } from '@/types/navigation';
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
  const { favorites, loading } = useFavoriteRecipes();
  const { profile } = useUserProfile(user?.uid);
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleRecipePress = (recipeId: number) => {
    navigation.navigate('Info', { id: recipeId });
  };

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

  const handleSettingsPress = () => {
    setShowLanguageSelector(true);
  };

  const renderRecipeCard = ({ item }: { item: FavoriteRecipeDoc }) => (
    <AnimatedPressable onPress={() => handleRecipePress(item.id)} style={styles.recipeCard} scaleValue={0.96}>
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: item.url }} style={styles.recipeImage} />
        <View style={styles.heartBadge}>
          <Ionicons name="heart" size={14} color={COLORS.primary} />
        </View>
      </View>
      <Text style={styles.recipeTitle} numberOfLines={1}>
        {t('recipe.savedRecipe')}
      </Text>
    </AnimatedPressable>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedPressable style={styles.headerButton} onPress={handleLogout} scaleValue={0.85}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <AnimatedPressable style={styles.headerButton} onPress={handleSettingsPress} scaleValue={0.85}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </AnimatedPressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              style={styles.avatar} 
              source={require('@assets/user.jpg')} 
            />
          </View>
          
          <Text style={styles.username}>
            {profile?.username || profile?.name || t('profile.anonymous')}
          </Text>
          
          <Text style={styles.bio}>
            {profile?.bio || t('profile.defaultBio')}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1.2k</Text>
              <Text style={styles.statLabel}>{t('profile.followers')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>450</Text>
              <Text style={styles.statLabel}>{t('profile.following')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="heart" 
              size={18} 
              color={activeTab === 'saved' ? COLORS.background : COLORS.textLight} 
            />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              {t('profile.saved')}
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'published' && styles.activeTab]}
            onPress={() => setActiveTab('published')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="restaurant-outline" 
              size={18} 
              color={activeTab === 'published' ? COLORS.background : COLORS.textLight} 
            />
            <Text style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}>
              {t('profile.published')}
            </Text>
          </AnimatedPressable>
          
          <AnimatedPressable
            style={styles.tab}
            pressableStyle={[styles.tabPressable, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
            scaleValue={0.92}
          >
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={activeTab === 'info' ? COLORS.background : COLORS.textLight} 
            />
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
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
                <View style={styles.recipeImageContainer}>
                  <Image source={{ uri: item.url }} style={styles.recipeImage} />
                  <View style={styles.heartBadge}>
                    <Ionicons name="heart" size={14} color={COLORS.primary} />
                  </View>
                </View>
              </AnimatedPressable>
            ))}
          </View>
        )}

        {activeTab === 'published' && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>{t('profile.noPublished')}</Text>
          </View>
        )}

        {activeTab === 'info' && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{user?.email || 'No email'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>{t('profile.memberSince')}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.tertiary,
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
    color: COLORS.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: COLORS.tertiary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
    padding: 3,
    backgroundColor: COLORS.background,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.text,
    marginTop: 12,
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
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
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.tertiary,
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
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.background,
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
    backgroundColor: COLORS.tertiary,

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
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
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
    color: COLORS.textLight,
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
    backgroundColor: COLORS.tertiary,
    borderRadius: 12,
  },
  infoText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
  },
});

export default ProfileScreen;
