import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useColors } from '@/shared/hooks/useColors';
import { FONTS } from '@/constants/theme';
import type { MainStackParamList } from '@/types/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import RecipeDetailSkeleton from '@/shared/components/RecipeDetailSkeleton';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  deletePublishedRecipe,
  getPublishedRecipeById,
  hasUserLikedPublishedRecipe,
  incrementPublishedRecipeShare,
  setPublishedRecipeLike,
  setPublishedRecipeSave,
  type PublishedRecipeDoc,
} from '../services/publishedRecipeService';
import {
  isPublishedFavoriteRecipeSaved,
  togglePublishedFavoriteRecipe,
} from '@/features/recipes/services/favoriteService';
import ReportReasonModal, { type ReportReasonKey } from '@/shared/components/ReportReasonModal';
import { reportRecipe } from '@/features/recipes/services/reportService';
import { useUserProfile } from '@/features/profile/hooks/useUserProfile';
import { setFollowUser, subscribeToFollowingStatus } from '@/features/profile/services/followService';

export type PublishedRecipeDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'PublishedInfo'>;

const PublishedRecipeDetailScreen: React.FC<PublishedRecipeDetailScreenProps> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAuth();
  const { showInfo, showConfirm, modal } = useAppAlertModal();
  const { id } = route.params;

  const [recipe, setRecipe] = useState<PublishedRecipeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [likedByMe, setLikedByMe] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [reportVisible, setReportVisible] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  const authorId = recipe?.authorId;
  const authorIsAnonymous = !authorId || authorId === 'anonymous';
  const { profile: authorProfile } = useUserProfile(authorIsAnonymous ? undefined : authorId);

  const canLike = !!user?.uid;
  const canFavorite = !!user?.uid;
  const canDeletePublished = !!user?.uid && !!recipe && recipe.authorId === user.uid;
  const canFollowAuthor = !!user?.uid && !!authorId && !authorIsAnonymous && authorId !== user?.uid;

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const result = await getPublishedRecipeById(id);
      if (!active) return;

      if (!result.success || !result.recipe) {
        setRecipe(null);
        setError(result.error ?? t('home.recipeNotFound'));
        setLoading(false);
        return;
      }

      setRecipe(result.recipe);
      setLikesCount(result.recipe.likesCount ?? 0);
      setError(null);
      setCheckedIngredients(new Set());

      if (user?.uid) {
        const liked = await hasUserLikedPublishedRecipe(id, user.uid);
        if (active) setLikedByMe(liked.success ? !!liked.liked : false);

        const saved = await isPublishedFavoriteRecipeSaved(user.uid, id);
        if (active) setFavorited(saved.success ? !!saved.saved : false);
      } else {
        setLikedByMe(false);
        setFavorited(false);
      }

      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [id, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !authorId || authorIsAnonymous || authorId === user.uid) {
      setIsFollowingAuthor(false);
      return;
    }
    return subscribeToFollowingStatus(user.uid, authorId, setIsFollowingAuthor);
  }, [authorId, authorIsAnonymous, user?.uid]);

  const ingredientsCount = useMemo(() => recipe?.ingredients?.length ?? 0, [recipe?.ingredients]);
  const stepsCount = useMemo(() => recipe?.steps?.length ?? 0, [recipe?.steps]);

  const toggleIngredientCheck = (ingredientId: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(ingredientId)) next.delete(ingredientId);
      else next.add(ingredientId);
      return next;
    });
  };

  const getDifficultyText = (readyInMinutes: number) => {
    if (readyInMinutes <= 20) return t('recipe.easy');
    if (readyInMinutes <= 45) return t('recipe.medium');
    return t('recipe.hard');
  };

  const difficultyLevel = useMemo(() => {
    if (!recipe) return 0;
    if (recipe.difficulty === 'easy') return 1;
    if (recipe.difficulty === 'medium') return 2;
    if (recipe.difficulty === 'hard') return 3;
    if (typeof recipe.readyInMinutes !== 'number' || recipe.readyInMinutes <= 0) return 0;
    const label = getDifficultyText(recipe.readyInMinutes);
    if (label === t('recipe.easy')) return 1;
    if (label === t('recipe.medium')) return 2;
    return 3;
  }, [recipe, t]);

  const renderDifficultyHats = (level: number) => {
    if (level <= 0) {
      return <Text style={[styles.infoText, { color: colors.textLight }]}>--</Text>;
    }
    return (
      <View style={styles.hatsRow}>
        {Array.from({ length: level }).map((_, index) => (
          <MaterialCommunityIcons
            key={`hat-${index}`}
            name="chef-hat"
            size={16}
            color={colors.textLight}
          />
        ))}
      </View>
    );
  };

  const handleGoBack = () => navigation.goBack();

  const handleToggleFollow = async () => {
    if (!user?.uid) {
      showInfo({
        title: t('common.error'),
        message: t('errors.loginRequiredToFollow'),
        confirmText: t('common.close'),
      });
      return;
    }
    if (!authorId || authorIsAnonymous || authorId === user.uid) return;

    setFollowingLoading(true);
    const result = await setFollowUser(user.uid, authorId, !isFollowingAuthor);
    setFollowingLoading(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('common.unknownError'),
        confirmText: t('common.close'),
      });
    }
  };

  const handleReportSubmit = async (reason: ReportReasonKey) => {
    if (!user?.uid) {
      showInfo({
        title: t('common.error'),
        message: t('errors.loginRequiredToReport'),
        confirmText: t('common.close'),
      });
      return;
    }

    setReporting(true);
    const result = await reportRecipe(user.uid, { type: 'published', id, title: recipe?.title }, reason);
    setReporting(false);
    setReportVisible(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('common.unknownError'),
        confirmText: t('common.close'),
      });
      return;
    }

    showInfo({
      title: t('report.successTitle'),
      message: t('report.successMessage'),
      confirmText: t('common.close'),
    });
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!user?.uid) {
      showInfo({ title: t('common.error'), message: t('errors.loginRequiredToSave'), confirmText: t('common.close') });
      return;
    }

    if (canDeletePublished) {
      showConfirm({
        title: t('social.published.deleteTitle'),
        message: t('social.published.deleteMessage'),
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        confirmVariant: 'destructive',
        iconName: 'trash-outline',
        onConfirm: async () => {
          if (favorited) {
            await togglePublishedFavoriteRecipe(user.uid, {
              publishedId: recipe.id,
              title: recipe.title,
              imageUrl: recipe.imageUrl,
              ingredients: recipe.ingredients,
              steps: recipe.steps,
              readyInMinutes: recipe.readyInMinutes,
              difficulty: recipe.difficulty,
            });
            setFavorited(false);
          }

          const result = await deletePublishedRecipe(recipe.id);
          if (!result.success) {
            showInfo({
              title: t('common.error'),
              message: result.error ?? t('common.unknownError'),
              confirmText: t('common.close'),
            });
            return;
          }

          navigation.goBack();
        },
      });
      return;
    }

    if (!favorited) return;
    showConfirm({
      title: t('favorites.deleteTitle'),
      message: t('favorites.deleteMessage'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      confirmVariant: 'destructive',
      iconName: 'trash-outline',
      onConfirm: async () => {
        const result = await togglePublishedFavoriteRecipe(user.uid, {
          publishedId: recipe.id,
          title: recipe.title,
          imageUrl: recipe.imageUrl,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          readyInMinutes: recipe.readyInMinutes,
          difficulty: recipe.difficulty,
        });
        if (!result.success) {
          showInfo({
            title: t('common.error'),
            message: result.error ?? t('errors.favoriteUpdateFailed'),
            confirmText: t('common.close'),
          });
          return;
        }
        setFavorited(false);
        await setPublishedRecipeSave(id, user.uid, false);
      },
    });
  };

  const handleToggleFavorite = async () => {
    if (!user?.uid || !recipe) {
      showInfo({ title: t('common.error'), message: t('errors.loginRequiredToSave'), confirmText: t('common.close') });
      return;
    }

    if (favoriting) return;
    setFavoriting(true);
    const result = await togglePublishedFavoriteRecipe(user.uid, {
      publishedId: recipe.id,
      title: recipe.title,
      imageUrl: recipe.imageUrl,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      readyInMinutes: recipe.readyInMinutes,
      difficulty: recipe.difficulty,
    });
    setFavoriting(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('errors.favoriteUpdateFailed'),
        confirmText: t('common.close'),
      });
      return;
    }
    setFavorited(!!result.favorited);
    await setPublishedRecipeSave(id, user.uid, !!result.favorited);
  };

  const handleToggleLike = async () => {
    if (!user?.uid) return;
    const nextLiked = !likedByMe;
    setLikedByMe(nextLiked);
    setLikesCount(current => Math.max(0, current + (nextLiked ? 1 : -1)));

    const result = await setPublishedRecipeLike(id, user.uid, nextLiked);
    if (result.success) return;

    setLikedByMe(!nextLiked);
    setLikesCount(current => Math.max(0, current + (nextLiked ? -1 : 1)));
  };

  const handleShare = async () => {
    if (!recipe) return;
    try {
      const result = await Share.share({
        message: recipe.title,
        url: recipe.imageUrl,
      });
      if (result.action === Share.sharedAction) {
        await incrementPublishedRecipeShare(id);
      }
    } catch {
      showInfo({ title: t('common.error'), message: t('errors.shareFailed'), confirmText: t('common.close') });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.tertiary }]}>
        <RecipeDetailSkeleton />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error ?? t('home.recipeNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.tertiary }]}>
      <View style={[styles.header, { backgroundColor: colors.tertiary }]}>
        <Pressable onPress={handleGoBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('recipe.details')}</Text>
        <View style={styles.headerRight}>
          {(canDeletePublished || favorited) && (
            <Pressable onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={22} color={colors.text} />
            </Pressable>
          )}
          <Pressable
            onPress={handleToggleFavorite}
            style={styles.headerButton}
            disabled={!canFavorite}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={24}
              color={favorited ? colors.primary : colors.text}
            />
          </Pressable>

          <Pressable onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </Pressable>

          <Pressable onPress={() => setReportVisible(true)} style={styles.headerButton}>
            <Ionicons name="flag-outline" size={22} color={colors.text} />
          </Pressable>

          <Pressable
            onPress={handleToggleLike}
            style={[styles.headerButton, styles.likeHeaderButton]}
            disabled={!canLike}
          >
            <View style={styles.likeHeader}>
              <Ionicons
                name={likedByMe ? 'thumbs-up' : 'thumbs-up-outline'}
                size={22}
                color={likedByMe ? colors.primary : colors.text}
              />
              <Text style={[styles.likeHeaderCount, { color: colors.textLight }]}>{likesCount}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
            <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
          </View>
        </View>

        <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.recipeTitle, { color: colors.text }]}>{recipe.title}</Text>
          <View style={styles.authorRow}>
            <View style={styles.authorLeft}>
              <Image
                source={
                  authorIsAnonymous
                    ? require('@assets/user.jpg')
                    : authorProfile?.photoUrl
                      ? { uri: authorProfile.photoUrl }
                      : require('@assets/user.jpg')
                }
                style={styles.authorAvatar}
              />
              <Text style={[styles.authorName, { color: colors.text }]} numberOfLines={1}>
                {authorIsAnonymous
                  ? t('profile.anonymous')
                  : authorProfile?.name || authorProfile?.username || t('profile.anonymous')}
              </Text>
            </View>
            {canFollowAuthor && (
              <Pressable
                onPress={handleToggleFollow}
                disabled={followingLoading}
                style={[
                  styles.followButton,
                  {
                    backgroundColor: isFollowingAuthor ? colors.tertiary : colors.primary,
                    borderColor: colors.primary,
                    opacity: followingLoading ? 0.6 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    { color: isFollowingAuthor ? colors.primary : colors.background },
                  ]}
                >
                  {isFollowingAuthor ? t('profile.followingAction') : t('profile.followAction')}
                </Text>
              </Pressable>
            )}
          </View>
          <Text style={[styles.metaText, { color: colors.textLight }]}>
            {ingredientsCount} {t('recipe.ingredients')} · {stepsCount} {t('recipe.instructions')}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="star-outline" size={16} color={colors.textLight} />
              <Text style={[styles.infoText, { color: colors.textLight }]}>4,8</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.tertiary }]} />
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={16} color={colors.textLight} />
              <Text style={[styles.infoText, { color: colors.textLight }]}>
                {typeof recipe.readyInMinutes === 'number' && recipe.readyInMinutes > 0
                  ? `${recipe.readyInMinutes} ${t('home.minutes')}`
                  : `-- ${t('home.minutes')}`}
              </Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.tertiary }]} />
            <View style={styles.infoItem}>{renderDifficultyHats(difficultyLevel)}</View>
          </View>

          <View style={[styles.tabsContainer, { backgroundColor: colors.tertiary }]}>
            <Pressable
              style={[
                styles.tab,
                { backgroundColor: activeTab === 'ingredients' ? colors.background : 'transparent' },
              ]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'ingredients' ? colors.primary : colors.textLight },
                ]}
              >
                {t('recipe.ingredients')}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tab,
                { backgroundColor: activeTab === 'instructions' ? colors.background : 'transparent' },
              ]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'instructions' ? colors.primary : colors.textLight },
                ]}
              >
                {t('recipe.instructions')}
              </Text>
            </Pressable>
          </View>

          {activeTab === 'ingredients' ? (
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((item, index) => {
                const ingredientId = index + 1;
                const isChecked = checkedIngredients.has(ingredientId);
                return (
                  <Pressable
                    key={`${ingredientId}-${item}`}
                    style={styles.ingredientRow}
                    onPress={() => toggleIngredientCheck(ingredientId)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: colors.primary },
                        isChecked && { backgroundColor: colors.primary, borderColor: colors.primary },
                      ]}
                    >
                      {isChecked && <Ionicons name="checkmark" size={14} color={colors.background} />}
                    </View>
                    <Text
                      style={[
                        styles.ingredientText,
                        { color: colors.text },
                        isChecked && { color: colors.textLight, textDecorationLine: 'line-through' },
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.list}>
              {recipe.steps.map((step, index) => (
                <View key={`${index}`} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumberText, { color: colors.background }]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <ReportReasonModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={handleReportSubmit}
        submitting={reporting}
      />
      {modal}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
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
  headerRight: {
    flexDirection: 'row',
  },
  likeHeaderButton: {
    width: 64,
  },
  likeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeHeaderCount: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    width: '85%',
    aspectRatio: 1.3,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    minHeight: 500,
  },
  recipeTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  authorLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorName: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  followButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  followButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
  metaText: {
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  infoDivider: {
    width: 1,
    height: 18,
  },
  hatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  list: {
    gap: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  ingredientsList: {
    gap: 0,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default PublishedRecipeDetailScreen;
