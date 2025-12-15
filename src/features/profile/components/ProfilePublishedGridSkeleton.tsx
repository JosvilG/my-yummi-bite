import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

type Props = {
  count?: number;
};

const ProfilePublishedGridSkeleton: React.FC<Props> = ({ count = 4 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          width={CARD_WIDTH}
          height={CARD_WIDTH}
          borderRadius={16}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
});

export default ProfilePublishedGridSkeleton;

