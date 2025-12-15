import { addDoc, collection } from 'firebase/firestore';
import { db, serverTimestamp } from '@/app/config/firebase';
import { captureException } from '@/lib/sentry';
import type { ReportReasonKey } from '@/shared/components/ReportReasonModal';

export type ReportTarget =
  | { type: 'spoonacular'; id: number; title?: string }
  | { type: 'published'; id: string; title?: string }
  | { type: 'custom'; id: string; title?: string };

export const reportRecipe = async (
  reporterId: string,
  target: ReportTarget,
  reason: ReportReasonKey
): Promise<{ success: boolean; error?: string }> => {
  try {
    await addDoc(collection(db, 'RecipeReports'), {
      reporterId,
      targetType: target.type,
      targetId: String(target.id),
      title: target.title ?? null,
      reason,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    captureException(error as Error, {
      operation: 'reportRecipe',
      reporterId,
      targetType: target.type,
      targetId: String(target.id),
      reason,
    });
    return { success: false, error: errorMessage };
  }
};

