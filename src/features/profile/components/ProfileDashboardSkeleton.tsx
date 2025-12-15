import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from '@/shared/components/Skeleton';
import { useColors } from '@/shared/hooks/useColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - 12) / 2;

const ProfileDashboardSkeleton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={180} height={18} borderRadius={8} />
        <Skeleton width={140} height={13} borderRadius={6} style={styles.subtitle} />
      </View>

      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={[styles.card, { backgroundColor: colors.tertiary }]}>
            <Skeleton width={34} height={34} borderRadius={17} style={styles.icon} />
            <Skeleton width={60} height={20} borderRadius={8} />
            <Skeleton width={70} height={12} borderRadius={6} style={styles.label} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 14,
  },
  icon: {
    marginBottom: 10,
  },
  label: {
    marginTop: 6,
  },
});

export default ProfileDashboardSkeleton;

