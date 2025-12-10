import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 340;

const RecipeDetailSkeleton: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero image */}
      <Skeleton 
        width={SCREEN_WIDTH} 
        height={BANNER_HEIGHT} 
        borderRadius={0} 
      />

      <View style={styles.content}>
        {/* Tags */}
        <View style={styles.tags}>
          <Skeleton width={80} height={32} borderRadius={16} />
          <Skeleton width={100} height={32} borderRadius={16} style={styles.tagSpacing} />
        </View>

        {/* Title */}
        <Skeleton width="90%" height={28} borderRadius={8} style={styles.title} />
        <Skeleton width="40%" height={20} borderRadius={6} style={styles.subtitle} />

        {/* Summary */}
        <View style={styles.summary}>
          <Skeleton width="100%" height={16} borderRadius={4} style={styles.line} />
          <Skeleton width="100%" height={16} borderRadius={4} style={styles.line} />
          <Skeleton width="80%" height={16} borderRadius={4} style={styles.line} />
          <Skeleton width="95%" height={16} borderRadius={4} style={styles.line} />
          <Skeleton width="60%" height={16} borderRadius={4} />
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Ingredients skeleton */}
        <Skeleton width={120} height={24} borderRadius={6} style={styles.sectionTitle} />
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width="70%" height={18} borderRadius={4} style={styles.ingredientText} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tagSpacing: {
    marginLeft: 12,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
  },
  summary: {
    marginBottom: 20,
  },
  line: {
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientText: {
    marginLeft: 12,
  },
});

export default RecipeDetailSkeleton;
