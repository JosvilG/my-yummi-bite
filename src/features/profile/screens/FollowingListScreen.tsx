import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '@/app/config/firebase';
import { useAuth } from '@/app/providers/AuthProvider';
import { useColors } from '@/shared/hooks/useColors';
import { FONTS } from '@/constants/theme';
import type { CommonStackParamList } from '@/types/navigation';
import type { UserProfile } from '../hooks/useUserProfile';
import FollowingListSkeleton from '../components/FollowingListSkeleton';

export type FollowingListScreenProps = NativeStackScreenProps<CommonStackParamList, 'FollowingList'>;

const FollowingListScreen: React.FC<FollowingListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAuth();

  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilesById, setProfilesById] = useState<Record<string, UserProfile | null>>({});

  const profileUnsubsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!user?.uid) {
      setFollowingIds([]);
      setProfilesById({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'following'),
      (snap) => {
        setFollowingIds(snap.docs.map(d => d.id));
        setLoading(false);
      },
      () => {
        setFollowingIds([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    const currentUnsubs = profileUnsubsRef.current;
    const nextSet = new Set(followingIds);

    for (const [id, unsub] of currentUnsubs.entries()) {
      if (!nextSet.has(id)) {
        unsub();
        currentUnsubs.delete(id);
        setProfilesById((prev) => {
          if (!(id in prev)) return prev;
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
    }

    for (const id of followingIds) {
      if (currentUnsubs.has(id)) continue;

      const unsub = onSnapshot(
        doc(db, 'users', id),
        (snap) => {
          setProfilesById(prev => ({
            ...prev,
            [id]: snap.exists() ? (snap.data() as UserProfile) : null,
          }));
        },
        () => {
          setProfilesById(prev => ({ ...prev, [id]: null }));
        }
      );
      currentUnsubs.set(id, unsub);
    }
  }, [followingIds]);

  useEffect(() => {
    return () => {
      for (const unsub of profileUnsubsRef.current.values()) unsub();
      profileUnsubsRef.current.clear();
    };
  }, []);

  const data = useMemo(() => followingIds, [followingIds]);

  const renderItem = ({ item: id }: { item: string }) => {
    const profile = profilesById[id];
    const avatarSource = profile?.photoUrl ? { uri: profile.photoUrl } : require('@assets/user.jpg');
    const displayName = profile?.name || profile?.username || t('profile.anonymous');

    return (
      <Pressable
        onPress={() => navigation.navigate('UserProfile', { userId: id })}
        style={[styles.row, { backgroundColor: colors.tertiary, borderColor: colors.border }]}
      >
        <Image source={avatarSource as any} style={styles.avatar} />
        <View style={styles.rowText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          {!!profile?.username && (
            <Text style={[styles.username, { color: colors.textLight }]} numberOfLines={1}>
              @{profile.username}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </Pressable>
    );
  };

  const empty = !loading && data.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.tertiary }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.followingListTitle')}</Text>
        <View style={styles.headerButton} />
      </View>

      {loading ? (
        <FollowingListSkeleton />
      ) : empty ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.tertiary }]}>
            <Ionicons name="people-outline" size={34} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('profile.followingListEmptyTitle')}</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>{t('profile.followingListEmptySubtitle')}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(id) => id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: 18,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  rowText: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  username: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default FollowingListScreen;
