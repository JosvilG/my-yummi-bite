import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '@/types/navigation';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColors } from '@/shared/hooks/useColors';
import { FONTS } from '@/constants/theme';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { useAuth } from '@/app/providers/AuthProvider';
import { saveCustomFavoriteRecipe, savePublishedFavoriteRecipe } from '@/features/recipes/services/favoriteService';
import { publishRecipe } from '../services/publishedRecipeService';
import { useAppAlertModal } from '@/shared/hooks/useAppAlertModal';
import CameraView from '@/features/recipes/components/CameraView';
type Props = BottomTabScreenProps<TabParamList, 'Add'>;

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80';

const CreatePostScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showInfo, modal } = useAppAlertModal();
  const ingredientInputRef = useRef<TextInput>(null);
  const stepInputRef = useRef<TextInput>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState('');
  const [ingredientText, setIngredientText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [stepText, setStepText] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [timeMinutes, setTimeMinutes] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [nutrition, setNutrition] = useState({
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  const canSubmit = useMemo(() => {
    const titleOk = recipeName.trim().length > 0;
    const parsedTime = Number.parseInt(timeMinutes.trim(), 10);
    const timeOk = Number.isFinite(parsedTime) && parsedTime > 0;
    const difficultyOk = !!difficulty;
    const ingredientsOk = ingredients.length > 0 || ingredientText.trim().length > 0;
    const stepsOk = steps.length > 0 || stepText.trim().length > 0;
    return titleOk && timeOk && difficultyOk && ingredientsOk && stepsOk;
  }, [difficulty, ingredientText, ingredients.length, recipeName, stepText, steps.length, timeMinutes]);

  const resetForm = () => {
    setPhotoUri(null);
    setRecipeName('');
    setIngredientText('');
    setIngredients([]);
    setStepText('');
    setSteps([]);
    setTimeMinutes('');
    setDifficulty(null);
    setNutrition({ calories: '', protein: '', fat: '', carbs: '' });
  };

  const handleSaveDraft = async () => {
    if (!user?.uid) {
      showInfo({ title: t('common.error'), message: t('errors.loginRequiredToSave'), confirmText: t('common.close') });
      return;
    }

    const title = recipeName.trim();
    if (!title) {
      showInfo({ title: t('common.error'), message: t('errors.recipeNameRequired'), confirmText: t('common.close') });
      return;
    }

    const parsedTime = Number.parseInt(timeMinutes.trim(), 10);
    const readyInMinutes = Number.isFinite(parsedTime) && parsedTime > 0 ? parsedTime : undefined;
    if (!readyInMinutes) {
      showInfo({ title: t('common.error'), message: t('errors.timeRequired'), confirmText: t('common.close') });
      return;
    }

    if (!difficulty) {
      showInfo({ title: t('common.error'), message: t('errors.difficultyRequired'), confirmText: t('common.close') });
      return;
    }

    const pendingIngredient = ingredientText.trim();
    const nextIngredients = pendingIngredient ? [pendingIngredient, ...ingredients] : ingredients;
    if (nextIngredients.length === 0) {
      showInfo({ title: t('common.error'), message: t('errors.ingredientsRequired'), confirmText: t('common.close') });
      return;
    }

    const pendingStep = stepText.trim();
    const nextSteps = pendingStep ? [...steps, pendingStep] : steps;
    if (nextSteps.length === 0) {
      showInfo({ title: t('common.error'), message: t('errors.stepsRequired'), confirmText: t('common.close') });
      return;
    }

    setSaving(true);
    const result = await saveCustomFavoriteRecipe(user.uid, {
      title,
      imageUrl: photoUri ?? FALLBACK_IMAGE_URL,
      ingredients: nextIngredients,
      steps: nextSteps,
      nutrition,
      readyInMinutes,
      difficulty,
    });
    setSaving(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('errors.saveRecipeFailed'),
        confirmText: t('common.close'),
      });
      return;
    }

    resetForm();
    navigation.navigate('Save');
  };

  const handlePickPhoto = () => {
    setCameraVisible(true);
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientText.trim();
    if (!trimmed) {
      ingredientInputRef.current?.focus();
      return;
    }
    setIngredients(current => [trimmed, ...current]);
    setIngredientText('');
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(current => current.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    const trimmed = stepText.trim();
    if (!trimmed) {
      stepInputRef.current?.focus();
      return;
    }
    setSteps(current => [...current, trimmed]);
    setStepText('');
  };

  const handleRemoveStep = (index: number) => {
    setSteps(current => current.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!user?.uid) {
      showInfo({ title: t('common.error'), message: t('errors.loginRequiredToPublish'), confirmText: t('common.close') });
      return;
    }

    const title = recipeName.trim();
    if (!title) {
      showInfo({ title: t('common.error'), message: t('errors.recipeNameRequired'), confirmText: t('common.close') });
      return;
    }

    const parsedTime = Number.parseInt(timeMinutes.trim(), 10);
    const readyInMinutes = Number.isFinite(parsedTime) && parsedTime > 0 ? parsedTime : undefined;
    if (!readyInMinutes) {
      showInfo({ title: t('common.error'), message: t('errors.timeRequired'), confirmText: t('common.close') });
      return;
    }

    if (!difficulty) {
      showInfo({ title: t('common.error'), message: t('errors.difficultyRequired'), confirmText: t('common.close') });
      return;
    }

    const pendingIngredient = ingredientText.trim();
    const nextIngredients = pendingIngredient ? [pendingIngredient, ...ingredients] : ingredients;
    if (nextIngredients.length === 0) {
      showInfo({ title: t('common.error'), message: t('errors.ingredientsRequired'), confirmText: t('common.close') });
      return;
    }

    const pendingStep = stepText.trim();
    const nextSteps = pendingStep ? [...steps, pendingStep] : steps;
    if (nextSteps.length === 0) {
      showInfo({ title: t('common.error'), message: t('errors.stepsRequired'), confirmText: t('common.close') });
      return;
    }

    setPublishing(true);
    const result = await publishRecipe({
      authorId: user.uid,
      title,
      imageUrl: photoUri ?? FALLBACK_IMAGE_URL,
      ingredients: nextIngredients,
      steps: nextSteps,
      nutrition,
      readyInMinutes,
      difficulty,
    });
    setPublishing(false);

    if (!result.success) {
      showInfo({
        title: t('common.error'),
        message: result.error ?? t('errors.publishRecipeFailed'),
        confirmText: t('common.close'),
      });
      return;
    }

    if (result.id) {
      await savePublishedFavoriteRecipe(user.uid, {
        publishedId: result.id,
        title,
        imageUrl: result.imageUrl ?? (photoUri ?? FALLBACK_IMAGE_URL),
        ingredients: nextIngredients,
        steps: nextSteps,
        nutrition,
        readyInMinutes,
        difficulty,
      });
    }

    resetForm();
    showInfo({
      title: t('social.create.publishedTitle'),
      message: t('social.create.publishedMessage'),
      confirmText: t('common.close'),
      iconName: 'checkmark-circle-outline',
    });
  };

  const tabBarOffset = 56 + Math.max(insets.bottom, 16) + 16;
  const bottomActionHeight = 56 + 10 + 16;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.tertiary }]} edges={['top']}>
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.secondary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerSide} />

          <Text style={styles.headerTitle}>{t('social.create.headerTitle')}</Text>

          <View style={[styles.headerSide, styles.headerSideRight]}>
            <AnimatedPressable
              onPress={handleSaveDraft}
              style={styles.headerAction}
              disabled={!canSubmit || saving}
              scaleValue={0.98}
            >
              <Text style={[styles.headerActionText, { opacity: canSubmit && !saving ? 1 : 0.6 }]}>
                {saving ? t('common.saving') : t('common.save')}
              </Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
              { paddingBottom: tabBarOffset + bottomActionHeight },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AnimatedPressable onPress={handlePickPhoto} style={styles.photoPressable} scaleValue={0.99}>
              <View style={styles.photoCard}>
                {photoUri ? (
                  <>
                    <Image source={{ uri: photoUri }} style={styles.photoBackground} />
                    <LinearGradient
                      colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.32)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.photoBackground}
                    />
                  </>
                ) : (
                  <LinearGradient
                    colors={[colors.peach, colors.coral]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.photoBackground}
                  />
                )}
                <Ionicons name="camera" size={44} color="#FFFFFF" />
                <Text style={styles.photoText}>
                  {photoUri ? t('social.create.photoSelected') : t('social.create.photoPlaceholder')}
                </Text>
              </View>
            </AnimatedPressable>

            <View style={styles.block}>
              <Text style={[styles.blockLabel, { color: colors.textLight }]}>{t('social.create.recipeNameLabel')}</Text>
              <TextInput
                value={recipeName}
                onChangeText={setRecipeName}
                placeholder={t('social.create.recipeNamePlaceholder')}
                placeholderTextColor={colors.textLight}
                style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text }]}
                autoCapitalize="sentences"
                returnKeyType="done"
              />
            </View>

            <View style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('social.create.detailsTitle')}</Text>

              <View style={styles.detailsRow}>
                <View style={styles.detailsCell}>
                  <Text style={[styles.detailsLabel, { color: colors.textLight }]}>{t('social.create.timeLabel')}</Text>
                  <TextInput
                    value={timeMinutes}
                    onChangeText={setTimeMinutes}
                    placeholder={t('social.create.timePlaceholder')}
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={[styles.detailsInput, { borderColor: colors.border, color: colors.text }]}
                  />
                </View>

                <View style={styles.detailsCell}>
                  <Text style={[styles.detailsLabel, { color: colors.textLight }]}>{t('social.create.difficultyLabel')}</Text>
                  <View style={[styles.difficultyRow, { borderColor: colors.border }]}>
                    {(['easy', 'medium', 'hard'] as const).map((level, index) => {
                      const selected = difficulty === level;
                      return (
                        <AnimatedPressable
                          key={level}
                          onPress={() => setDifficulty(level)}
                          style={[
                            styles.difficultyChip,
                            { backgroundColor: selected ? colors.primary : colors.background, borderColor: colors.border },
                          ]}
                          scaleValue={0.96}
                        >
                          <View style={styles.difficultyHatRow}>
                            {Array.from({ length: index + 1 }).map((_, hatIndex) => (
                              <MaterialCommunityIcons
                                key={`${level}-${hatIndex}`}
                                name="chef-hat"
                                size={16}
                                color={selected ? colors.background : colors.text}
                              />
                            ))}
                          </View>
                        </AnimatedPressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('social.create.ingredientsTitle')}</Text>

              {ingredients.length > 0 && (
                <View style={styles.list}>
                  {ingredients.map((item, index) => (
                    <View key={`${item}-${index}`} style={styles.listRow}>
                      <Text style={[styles.listText, { color: colors.text }]}>{item}</Text>
                      <AnimatedPressable onPress={() => handleRemoveIngredient(index)} scaleValue={0.9}>
                        <Ionicons name="close-circle" size={22} color={colors.textLight} />
                      </AnimatedPressable>
                    </View>
                  ))}
                </View>
              )}

              <TextInput
                ref={ingredientInputRef}
                value={ingredientText}
                onChangeText={setIngredientText}
                placeholder={t('social.create.ingredientPlaceholder')}
                placeholderTextColor={colors.textLight}
                style={[styles.inlineInput, { borderColor: colors.border, color: colors.text }]}
                returnKeyType="done"
                onSubmitEditing={handleAddIngredient}
              />

              <View style={styles.addCenter}>
                <AnimatedPressable
                  onPress={handleAddIngredient}
                  style={[styles.addCircle, { backgroundColor: colors.coral }]}
                  scaleValue={0.92}
                >
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </AnimatedPressable>
                <Text style={[styles.addLabel, { color: colors.coral }]}>{t('social.create.addIngredient')}</Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('social.create.preparationTitle')}</Text>

              {steps.length > 0 && (
                <View style={styles.list}>
                  {steps.map((item, index) => (
                    <View key={`${index}`} style={styles.stepRow}>
                      <Text style={[styles.stepNumber, { color: colors.textLight }]}>{index + 1}.</Text>
                      <Text style={[styles.stepText, { color: colors.text }]}>{item}</Text>
                      <AnimatedPressable onPress={() => handleRemoveStep(index)} scaleValue={0.9}>
                        <Ionicons name="close-circle" size={22} color={colors.textLight} />
                      </AnimatedPressable>
                    </View>
                  ))}
                </View>
              )}

              <TextInput
                ref={stepInputRef}
                value={stepText}
                onChangeText={setStepText}
                placeholder={t('social.create.stepPlaceholder')}
                placeholderTextColor={colors.textLight}
                style={[styles.inlineInput, { borderColor: colors.border, color: colors.text }]}
                returnKeyType="done"
                onSubmitEditing={handleAddStep}
              />

              <View style={styles.addCenter}>
                <AnimatedPressable
                  onPress={handleAddStep}
                  style={[styles.addCircle, { backgroundColor: colors.coral }]}
                  scaleValue={0.92}
                >
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </AnimatedPressable>
                <Text style={[styles.addLabel, { color: colors.coral }]}>{t('social.create.addStep')}</Text>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: colors.background }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('social.create.nutritionTitle')}</Text>

              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionCell}>
                  <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.calories')}</Text>
                  <TextInput
                    value={nutrition.calories}
                    onChangeText={(value) => setNutrition(current => ({ ...current, calories: value }))}
                    placeholder="450"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={[styles.nutritionInput, { color: colors.text }]}
                  />
                  <View style={[styles.nutritionBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.coral }]} />
                  </View>
                </View>

                <View style={styles.nutritionCell}>
                  <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.protein')}</Text>
                  <TextInput
                    value={nutrition.protein}
                    onChangeText={(value) => setNutrition(current => ({ ...current, protein: value }))}
                    placeholder="25"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={[styles.nutritionInput, { color: colors.text }]}
                  />
                  <View style={[styles.nutritionBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.coral }]} />
                  </View>
                </View>

                <View style={styles.nutritionCell}>
                  <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.fat')}</Text>
                  <TextInput
                    value={nutrition.fat}
                    onChangeText={(value) => setNutrition(current => ({ ...current, fat: value }))}
                    placeholder="18"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={[styles.nutritionInput, { color: colors.text }]}
                  />
                  <View style={[styles.nutritionBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.coral }]} />
                  </View>
                </View>

                <View style={styles.nutritionCell}>
                  <Text style={[styles.nutritionLabel, { color: colors.textLight }]}>{t('recipe.carbs')}</Text>
                  <TextInput
                    value={nutrition.carbs}
                    onChangeText={(value) => setNutrition(current => ({ ...current, carbs: value }))}
                    placeholder="40"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={[styles.nutritionInput, { color: colors.text }]}
                  />
                  <View style={[styles.nutritionBar, { backgroundColor: colors.border }]}>
                    <View style={[styles.nutritionBarFill, { backgroundColor: colors.coral }]} />
                  </View>
                </View>
              </View>

              <AnimatedPressable onPress={() => {}} scaleValue={0.98} style={styles.moreNutrition}>
                <Text style={[styles.moreNutritionText, { color: colors.coral }]}>{t('social.create.moreNutrition')}</Text>
              </AnimatedPressable>
            </View>
          <View style={[styles.bottomBar, { bottom: tabBarOffset }]}>
            <AnimatedPressable
              onPress={handlePublish}
              disabled={!canSubmit || publishing}
              scaleValue={0.98}
              style={styles.publishPressable}
            >
              <LinearGradient
                colors={[colors.coral, colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.publishButton, { opacity: canSubmit && !publishing ? 1 : 0.6 }]}
              >
                <Text style={styles.publishText}>
                  {publishing ? t('social.create.publishing') : t('social.create.publish')}
                </Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>
          </ScrollView>

        </KeyboardAvoidingView>
      </View>
      <Modal visible={cameraVisible} animationType="slide" onRequestClose={() => setCameraVisible(false)}>
        <SafeAreaView style={[styles.cameraModal, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
          <View style={styles.cameraHeader}>
            <AnimatedPressable
              onPress={() => setCameraVisible(false)}
              style={styles.cameraCloseButton}
              pressableStyle={styles.cameraCloseButtonInner}
              scaleValue={0.9}
            >
              <Ionicons name="close" size={26} color={colors.text} />
            </AnimatedPressable>
          </View>
          <View style={styles.cameraBody}>
            <CameraView
              onPhotoCaptured={(uri) => {
                setPhotoUri(uri);
                setCameraVisible(false);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
      {modal}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerSide: {
    width: 84,
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerAction: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerActionText: {
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
    fontSize: 14,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  photoPressable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  photoCard: {
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  photoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  photoText: {
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  block: {
    marginTop: 16,
  },
  blockLabel: {
    fontFamily: FONTS.medium,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  card: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsCell: {
    flex: 1,
  },
  detailsLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 2,
  },
  detailsInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderWidth: 1,
    borderRadius: 14,
  },
  difficultyChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyChipText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  difficultyHatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBody: {
    flex: 1,
  },
  list: {
    gap: 10,
    marginBottom: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  listText: {
    flex: 1,
    fontFamily: FONTS.regular,
  },
  inlineInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: 12,
  },
  addCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumber: {
    width: 20,
    textAlign: 'right',
    fontFamily: FONTS.medium,
    marginTop: 1,
  },
  stepText: {
    flex: 1,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionCell: {
    width: '47%',
  },
  nutritionLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  nutritionInput: {
    marginTop: 6,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  nutritionBar: {
    height: 3,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  nutritionBarFill: {
    width: '60%',
    height: 3,
  },
  moreNutrition: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  moreNutritionText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  publishPressable: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  publishButton: {
    minHeight: 56,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  publishText: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CreatePostScreen;
