import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { useColors } from '@/shared/hooks/useColors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

const RecipeCardSkeleton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.shapesContainer}>
        <Skeleton width={120} height={120} borderRadius={60} style={styles.shape1} />
        <Skeleton width={80} height={80} borderRadius={40} style={styles.shape2} />
        <Skeleton width={60} height={60} borderRadius={30} style={styles.shape3} />
        <Skeleton width={100} height={100} borderRadius={50} style={styles.shape4} />
        <Skeleton width={50} height={50} borderRadius={25} style={styles.shape5} />
      </View>

      <View style={styles.content}>
        <Skeleton 
          width={SCREEN_WIDTH * 0.75} 
          height={SCREEN_WIDTH * 0.5} 
          borderRadius={20} 
        />

        <View style={styles.infoContainer}>
          <Skeleton width="70%" height={28} borderRadius={8} style={styles.title} />
          <Skeleton width="25%" height={18} borderRadius={6} style={styles.calories} />
          <Skeleton width="90%" height={14} borderRadius={4} style={styles.summaryLine} />
          <Skeleton width="85%" height={14} borderRadius={4} style={styles.summaryLine} />
          <Skeleton width="60%" height={14} borderRadius={4} style={styles.summaryLine} />
        </View>

        <View style={styles.actions}>
          <Skeleton width={56} height={56} borderRadius={28} />
          <Skeleton width={48} height={48} borderRadius={24} />
          <Skeleton width={56} height={56} borderRadius={28} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 40,
    height: CARD_HEIGHT,
    borderRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  shapesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  shape1: {
    position: 'absolute',
    top: -30,
    left: -30,
  },
  shape2: {
    position: 'absolute',
    top: 40,
    right: -20,
  },
  shape3: {
    position: 'absolute',
    top: 150,
    left: 20,
  },
  shape4: {
    position: 'absolute',
    bottom: 100,
    right: -30,
  },
  shape5: {
    position: 'absolute',
    bottom: 180,
    left: -10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    width: '100%',
  },
  title: {
    marginBottom: 8,
  },
  calories: {
    marginBottom: 16,
  },
  summaryLine: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 24,
  },
});

export default RecipeCardSkeleton;
