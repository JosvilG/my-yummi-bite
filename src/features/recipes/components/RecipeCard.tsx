import React, { useState } from 'react';
import { 
  Dimensions, 
  Image, 
  Pressable,
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import type { RecipeSummary } from '../services/spoonacularService';
import type { CommonStackParamList } from '@/types/navigation';
import { log } from '@/lib/logger';
import type { PublishedRecipeDoc } from '@/features/social/services/publishedRecipeService';
import ReportReasonModal, { type ReportReasonKey } from '@/shared/components/ReportReasonModal';
import { reportRecipe } from '../services/reportService';
import { useAuth } from '@/app/providers/AuthProvider';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import { useTranslation } from 'react-i18next';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

type HomeCard = RecipeSummary | PublishedRecipeDoc;

const isPublishedRecipe = (recipe: HomeCard): recipe is PublishedRecipeDoc => typeof recipe.id === 'string';

const getHighResImageUrl = (recipe: HomeCard): string => {
  if (isPublishedRecipe(recipe)) {
    return recipe.imageUrl;
  }

  if (recipe.image) {
    const sizePattern = /-\d+x\d+\./;
    if (sizePattern.test(recipe.image)) {
      return recipe.image.replace(sizePattern, '-636x393.');
    }
    return recipe.image;
  }
  return `https://img.spoonacular.com/recipes/${recipe.id}-636x393.jpg`;
};

interface Props {
  recipe?: HomeCard;
  onSkip?: () => void;
  onSave?: () => void;
  onTogglePublishedLike?: (publishedId: string, liked: boolean) => void;
}

const RecipeCard: React.FC<Props> = ({ recipe, onSkip, onSave, onTogglePublishedLike }) => {
  const navigation = useNavigation<NativeStackNavigationProp<CommonStackParamList>>();
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAuth();
  const { showInfo, modal } = useAppAlertModal();
  const [reportVisible, setReportVisible] = useState(false);
  const [reporting, setReporting] = useState(false);

  if (!recipe) {
    return null;
  }

  const imageSource = getHighResImageUrl(recipe);
  const title = recipe.title ?? '';
  const likesCount = isPublishedRecipe(recipe) ? recipe.likesCount ?? 0 : 0;
  const likedByMe = isPublishedRecipe(recipe) ? !!recipe.likedByMe : false;
  const readyInMinutes = (recipe.readyInMinutes ?? 0) as number;
  const difficultyLevel = (() => {
    if (isPublishedRecipe(recipe)) {
      if (recipe.difficulty === 'easy') return 1;
      if (recipe.difficulty === 'medium') return 2;
      if (recipe.difficulty === 'hard') return 3;
    }
    if (!readyInMinutes) return 0;
    if (readyInMinutes <= 20) return 1;
    if (readyInMinutes <= 45) return 2;
    return 3;
  })();

  const handleInfoPress = () => {
    if (isPublishedRecipe(recipe)) {
      navigation.navigate('PublishedInfo', { id: recipe.id });
      return;
    }
    log.info('Navigation to recipe details', { recipeId: recipe.id, title: recipe.title });
    navigation.navigate('Info', { id: recipe.id });
  };

  const handleHeartPress = () => {
    onSave?.();
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
    const target = isPublishedRecipe(recipe)
      ? { type: 'published' as const, id: recipe.id, title: recipe.title }
      : { type: 'spoonacular' as const, id: recipe.id, title: recipe.title };

    const result = await reportRecipe(user.uid, target, reason);
    setReporting(false);
    setReportVisible(false);

    if (!result.success) {
      showInfo({ title: t('common.error'), message: result.error ?? t('common.unknownError'), confirmText: t('common.close') });
      return;
    }

    showInfo({
      title: t('report.successTitle'),
      message: t('report.successMessage'),
      confirmText: t('common.close'),
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageSource }} style={styles.recipeImage} />
          <Pressable
            onPress={() => setReportVisible(true)}
            style={[styles.reportBadge, { backgroundColor: colors.background, borderColor: colors.border }]}
            hitSlop={10}
          >
            <Ionicons name="flag-outline" size={18} color={colors.teal} />
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text numberOfLines={2} style={[styles.title, { color: colors.primary }]}>
              {title}
            </Text>
            {isPublishedRecipe(recipe) && (
              <Pressable
                onPress={() => onTogglePublishedLike?.(recipe.id, likedByMe)}
                style={styles.likeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={likedByMe ? 'thumbs-up' : 'thumbs-up-outline'}
                  size={18}
                  color={likedByMe ? colors.primary : colors.textLight}
                />
                <Text style={[styles.likeCount, { color: colors.textLight }]}>{likesCount}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.textLight} />
              <Text style={[styles.metaText, { color: colors.textLight }]}>
                {readyInMinutes ? `${readyInMinutes} ${t('home.minutes')}` : `-- ${t('home.minutes')}`}
              </Text>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metaItem}>
              {difficultyLevel > 0 ? (
                <View style={styles.hatsRow}>
                  {Array.from({ length: difficultyLevel }).map((_, index) => (
                    <MaterialCommunityIcons
                      key={`hat-${index}`}
                      name="chef-hat"
                      size={16}
                      color={colors.textLight}
                    />
                  ))}
                </View>
              ) : (
                <Text style={[styles.metaText, { color: colors.textLight }]}>--</Text>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.error }]} 
              onPress={onSkip}
              scaleValue={0.85}
            >
              <Ionicons name="close" size={28} color={colors.error} />
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.teal }]} 
              onPress={handleInfoPress}
              scaleValue={0.85}
            >
              <Ionicons name="information" size={24} color={colors.teal} />
            </AnimatedPressable>
            
            <AnimatedPressable 
              style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.teal }]} 
              onPress={handleHeartPress}
              scaleValue={0.85}
            >
              <Ionicons name="heart" size={28} color={colors.teal} />
            </AnimatedPressable>

          </View>
        </View>
      </View>

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
    maxHeight: CARD_HEIGHT,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  imageContainer: {
    flex: 1,
    minHeight: '50%',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reportBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  titleRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 24,
    textAlign: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
  },
  likeCount: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 16,
  },
  metaText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  hatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    gap: 20,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default RecipeCard;
