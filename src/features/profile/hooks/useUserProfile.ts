import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/config/firebase';

export interface UserProfile {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  bio?: string;
  photoUrl?: string;
  followersCount?: number;
  followingCount?: number;
  accountStatus?: 'active' | 'paused';
}

export const useUserProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { profile, loading, error };
};
