import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - 48) / 3;

interface Props {
  count?: number;
}

const FavoriteGridSkeleton: React.FC<Props> = ({ count = 9 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          width={ITEM_SIZE}
          height={ITEM_SIZE}
          borderRadius={12}
          style={styles.item}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: COLORS.background,
  },
  item: {
    margin: 4,
  },
});

export default FavoriteGridSkeleton;
