import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import type { UserProfile } from '../hooks/useUserProfile';

interface Props {
  profile?: UserProfile | null;
  savedCount: number;
}

const ProfileHeader: React.FC<Props> = ({ profile, savedCount }: Props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={require('@assets/user.jpg')} />
      <Text style={styles.username}>{profile?.username || profile?.name || 'Anonymous'}</Text>
      <Text style={styles.name}>{profile?.name || 'Food Lover'}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{savedCount}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
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
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    backgroundColor: COLORS.secondary,
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.primary,
  },
  name: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: FONTS.medium,
    color: COLORS.textLight,
    fontSize: 12,
  },
});

export default ProfileHeader;
