import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';

type Props = {
  count?: number;
};

const FollowingListSkeleton: React.FC<Props> = ({ count = 8 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.text}>
            <Skeleton width={160} height={14} borderRadius={7} />
            <Skeleton width={110} height={12} borderRadius={6} style={styles.sub} />
          </View>
          <Skeleton width={20} height={20} borderRadius={10} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    paddingBottom: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  text: {
    flex: 1,
  },
  sub: {
    marginTop: 8,
  },
});

export default FollowingListSkeleton;
