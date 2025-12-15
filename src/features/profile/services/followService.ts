import { collection, doc, getDocs, increment, limit, onSnapshot, query, runTransaction } from 'firebase/firestore';
import { db, serverTimestamp } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';

export const getFollowingUserIds = async (
  userId: string,
  max = 10
): Promise<{ success: boolean; userIds?: string[]; error?: string }> => {
  try {
    const q = query(collection(db, 'users', userId, 'following'), limit(max));
    const snap = await getDocs(q);
    return { success: true, userIds: snap.docs.map(d => d.id) };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'getFollowingUserIds', userId });
    return { success: false, error: errorMessage };
  }
};

export const subscribeToFollowingStatus = (
  userId: string,
  targetUserId: string,
  callback: (isFollowing: boolean) => void
) => {
  const ref = doc(db, 'users', userId, 'following', targetUserId);
  return onSnapshot(
    ref,
    (snap) => callback(snap.exists()),
    () => callback(false)
  );
};

export const setFollowUser = async (
  userId: string,
  targetUserId: string,
  follow: boolean
): Promise<{ success: boolean; error?: string }> => {
  if (!userId || !targetUserId || userId === targetUserId) return { success: false, error: 'Invalid user' };
  try {
    const followerRef = doc(db, 'users', targetUserId, 'followers', userId);
    const followingRef = doc(db, 'users', userId, 'following', targetUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    const userRef = doc(db, 'users', userId);

    await runTransaction(db, async (tx) => {
      const followerSnap = await tx.get(followerRef);

      if (follow) {
        if (followerSnap.exists()) return;
        tx.set(followerRef, { createdAt: serverTimestamp() });
        tx.set(followingRef, { createdAt: serverTimestamp() });
        tx.update(targetUserRef, { followersCount: increment(1), updatedAt: serverTimestamp() });
        tx.update(userRef, { followingCount: increment(1), updatedAt: serverTimestamp() });
        return;
      }

      if (!followerSnap.exists()) return;
      tx.delete(followerRef);
      tx.delete(followingRef);
      tx.update(targetUserRef, { followersCount: increment(-1), updatedAt: serverTimestamp() });
      tx.update(userRef, { followingCount: increment(-1), updatedAt: serverTimestamp() });
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'setFollowUser', userId, targetUserId, follow });
    return { success: false, error: errorMessage };
  }
};
