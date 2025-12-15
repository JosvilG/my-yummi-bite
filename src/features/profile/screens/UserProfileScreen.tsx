import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/shared/hooks/useColors';
import { FONTS } from '@/constants/theme';
import type { CommonStackParamList } from '@/types/navigation';
import { useUserProfile } from '../hooks/useUserProfile';
import { subscribeToPublishedRecipesByAuthor, type PublishedRecipeDoc } from '@/features/social/services/publishedRecipeService';
import ProfileDashboardSkeleton from '../components/ProfileDashboardSkeleton';
import ProfilePublishedGridSkeleton from '../components/ProfilePublishedGridSkeleton';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import Skeleton from '@/shared/components/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export type UserProfileScreenProps = NativeStackScreenProps<CommonStackParamList, 'UserProfile'>;

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { userId } = route.params;

  const { profile, loading: profileLoading } = useUserProfile(userId);
  const [publishedByUser, setPublishedByUser] = useState<PublishedRecipeDoc[]>([]);
  const [publishedLoading, setPublishedLoading] = useState(false);
  const [publishedError, setPublishedError] = useState<string | null>(null);

  useEffect(() => {
    setPublishedLoading(true);
    const unsubscribe = subscribeToPublishedRecipesByAuthor(
      userId,
      (result) => {
        if (!result.success) {
          setPublishedByUser([]);
          setPublishedError(result.error ?? t('common.unknownError'));
          setPublishedLoading(false);
          return;
        }
        setPublishedByUser(result.recipes ?? []);
        setPublishedError(null);
        setPublishedLoading(false);
      },
      50
    );

    return unsubscribe;
  }, [t, userId]);

  const stats = useMemo(() => {
    const publishedCount = publishedByUser.length;
    const likes = publishedByUser.reduce((sum, r) => sum + (r.likesCount ?? 0), 0);
    const saves = publishedByUser.reduce((sum, r) => sum + (r.savesCount ?? 0), 0);
    const shares = publishedByUser.reduce((sum, r) => sum + (r.sharesCount ?? 0), 0);
    return { publishedCount, likes, saves, shares };
  }, [publishedByUser]);

  const avatarSource = profile?.photoUrl ? { uri: profile.photoUrl } : require('@assets/user.jpg');
  const displayName = profile?.name || profile?.username || t('profile.anonymous');

  const renderPublishedCard = (item: PublishedRecipeDoc) => (
    <AnimatedPressable
      key={item.id}
      onPress={() => navigation.navigate('PublishedInfo', { id: item.id })}
      style={styles.recipeCard}
      scaleValue={0.96}
    >
      <View style={[styles.recipeImageContainer, { backgroundColor: colors.tertiary }]}>
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      </View>
      <Text style={[styles.recipeTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
    </AnimatedPressable>
  );

  const showSkeleton = profileLoading && !profile;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.tertiary }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.userProfileTitle')}</Text>
        <View style={styles.headerButton} />
      </View>

      {showSkeleton ? (
        <>
          <View style={[styles.profileSection, { backgroundColor: colors.tertiary }]}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary, backgroundColor: colors.background }]}>
              <Skeleton width="100%" height="100%" borderRadius={50} />
            </View>
            <Skeleton width={180} height={22} borderRadius={10} style={styles.skeletonName} />
            <Skeleton width={240} height={14} borderRadius={8} style={styles.skeletonBio} />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Skeleton width={44} height={18} borderRadius={8} />
                <Skeleton width={70} height={12} borderRadius={6} style={styles.skeletonStatLabel} />
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Skeleton width={44} height={18} borderRadius={8} />
                <Skeleton width={70} height={12} borderRadius={6} style={styles.skeletonStatLabel} />
              </View>
            </View>
          </View>
          <ProfileDashboardSkeleton />
          <ProfilePublishedGridSkeleton />
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.profileSection, { backgroundColor: colors.tertiary }]}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary, backgroundColor: colors.background }]}>
              <Image style={styles.avatar} source={avatarSource as any} />
            </View>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.bio, { color: colors.textLight }]} numberOfLines={2}>
              {profile?.bio || t('profile.defaultBio')}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{profile?.followersCount ?? 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.followers')}</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>{profile?.followingCount ?? 0}</Text>
                <Text style={[styles.statLabel, { color: colors.textLight }]}>{t('profile.following')}</Text>
              </View>
            </View>
          </View>

          {publishedLoading ? (
            <ProfileDashboardSkeleton />
          ) : publishedError ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>{publishedError}</Text>
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
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{stats.publishedCount}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statPublished')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="heart-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{stats.saves}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statSaves')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="thumbs-up-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{stats.likes}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statLikes')}</Text>
                </View>

                <View style={[styles.dashboardCard, { backgroundColor: colors.tertiary }]}>
                  <View style={[styles.dashboardIcon, { backgroundColor: colors.background }]}>
                    <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.dashboardValue, { color: colors.text }]}>{stats.shares}</Text>
                  <Text style={[styles.dashboardLabel, { color: colors.textLight }]}>{t('profile.statShares')}</Text>
                </View>
              </View>
            </View>
          )}

          {publishedLoading ? (
            <ProfilePublishedGridSkeleton />
          ) : publishedByUser.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color={colors.border} />
              <Text style={[styles.emptyText, { color: colors.textLight }]}>{t('profile.noPublished')}</Text>
            </View>
          ) : (
            <View style={styles.recipesGrid}>
              {publishedByUser.map(renderPublishedCard)}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
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
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  name: {
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
  skeletonName: {
    marginTop: 14,
  },
  skeletonBio: {
    marginTop: 12,
  },
  skeletonStatLabel: {
    marginTop: 6,
  },
  dashboardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
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
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 120,
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
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default UserProfileScreen;
