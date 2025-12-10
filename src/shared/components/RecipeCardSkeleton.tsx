import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

const RecipeCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton 
        width={SCREEN_WIDTH - 40} 
        height={CARD_HEIGHT} 
        borderRadius={24} 
      />
      <View style={styles.overlay}>
        <Skeleton width="80%" height={28} borderRadius={8} style={styles.title} />
        <Skeleton width="30%" height={20} borderRadius={6} style={styles.subtitle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 40,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.secondary,
    marginHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {},
});

export default RecipeCardSkeleton;
