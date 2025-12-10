import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { useColors } from '@/shared/hooks/useColors';

const ProfileSkeleton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Skeleton width={110} height={110} borderRadius={55} style={styles.avatar} />
      
      <Skeleton width={150} height={24} borderRadius={8} style={styles.username} />
      
      <Skeleton width={100} height={16} borderRadius={6} style={styles.name} />
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Skeleton width={40} height={24} borderRadius={6} />
          <Skeleton width={50} height={14} borderRadius={4} style={styles.statLabel} />
        </View>
        <View style={styles.stat}>
          <Skeleton width={40} height={24} borderRadius={6} />
          <Skeleton width={50} height={14} borderRadius={4} style={styles.statLabel} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  username: {
    marginBottom: 8,
  },
  name: {
    marginBottom: 4,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 4,
  },
});

export default ProfileSkeleton;
