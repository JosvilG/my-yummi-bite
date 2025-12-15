import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';

export type UpdateProfileInput = {
  name: string;
  bio: string;
  photoUrl?: string;
};

const shouldUploadImage = (uriOrUrl?: string): boolean => {
  const value = String(uriOrUrl || '').trim().toLowerCase();
  if (!value) return false;
  return !value.startsWith('http://') && !value.startsWith('https://');
};

export const uploadUserProfilePhoto = async (
  userId: string,
  localUri: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const ext = localUri.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const fileRef = ref(storage, `public/users/${userId}/avatar_${Date.now()}.${ext}`);
    await uploadBytes(fileRef, blob, { contentType: ext === 'png' ? 'image/png' : 'image/jpeg' });
    const url = await getDownloadURL(fileRef);
    return { success: true, url };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'uploadUserProfilePhoto', userId });
    return { success: false, error: errorMessage };
  }
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput
): Promise<{ success: boolean; error?: string }> => {
  try {
    let photoUrl = input.photoUrl;
    if (photoUrl && shouldUploadImage(photoUrl)) {
      const uploaded = await uploadUserProfilePhoto(userId, photoUrl);
      if (!uploaded.success || !uploaded.url) {
        return { success: false, error: uploaded.error ?? 'Photo upload failed' };
      }
      photoUrl = uploaded.url;
    }

    await updateDoc(doc(db, 'users', userId), {
      name: input.name,
      bio: input.bio,
      ...(photoUrl ? { photoUrl } : {}),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, { operation: 'updateUserProfile', userId });
    return { success: false, error: errorMessage };
  }
};

