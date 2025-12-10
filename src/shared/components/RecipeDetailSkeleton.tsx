import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { useColors } from '@/shared/hooks/useColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RecipeDetailSkeleton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.tertiary }]}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton width={140} height={20} borderRadius={10} />
        <View style={styles.headerRight}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginLeft: 8 }} />
        </View>
      </View>

      <View style={styles.heroSection}>
        <Skeleton 
          width={SCREEN_WIDTH * 0.85} 
          height={SCREEN_WIDTH * 0.65} 
          borderRadius={20} 
        />
      </View>

      <View style={[styles.contentCard, { backgroundColor: colors.background }]}>
        <Skeleton width="80%" height={26} borderRadius={8} style={styles.title} />

        <View style={styles.infoRow}>
          <Skeleton width={50} height={16} borderRadius={8} />
          <Skeleton width={70} height={16} borderRadius={8} />
          <Skeleton width={50} height={16} borderRadius={8} />
        </View>

        <Skeleton width="100%" height={50} borderRadius={25} style={styles.tabs} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Skeleton width={22} height={22} borderRadius={11} />
              <Skeleton width={40} height={40} borderRadius={8} style={styles.ingredientImage} />
              <Skeleton width="60%" height={18} borderRadius={4} />
            </View>
          ))}
        </ScrollView>

        <View style={[styles.nutritionContainer, { backgroundColor: colors.tertiary }]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.nutritionItem}>
              <Skeleton width={45} height={22} borderRadius={6} />
              <Skeleton width={60} height={14} borderRadius={4} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>
      </View>
    </View>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentCard: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  tabs: {
    marginBottom: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  ingredientImage: {
    marginHorizontal: 12,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  nutritionItem: {
    alignItems: 'center',
  },
});

export default RecipeDetailSkeleton;
