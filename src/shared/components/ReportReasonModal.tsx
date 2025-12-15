import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

export type ReportReasonKey = 'spam' | 'inappropriate' | 'misleading' | 'copyright' | 'other';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReasonKey) => void | Promise<void>;
  submitting?: boolean;
};

const ReportReasonModal: React.FC<Props> = ({ visible, onClose, onSubmit, submitting }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const [selectedReason, setSelectedReason] = useState<ReportReasonKey | null>(null);

  useEffect(() => {
    if (visible) setSelectedReason(null);
  }, [visible]);

  const reasons = useMemo(
    () =>
      ([
        { key: 'spam', label: t('report.reasons.spam') },
        { key: 'inappropriate', label: t('report.reasons.inappropriate') },
        { key: 'misleading', label: t('report.reasons.misleading') },
        { key: 'copyright', label: t('report.reasons.copyright') },
        { key: 'other', label: t('report.reasons.other') },
      ] as const),
    [t]
  );

  const canSubmit = !!selectedReason && !submitting;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tertiary }]}>
            <Ionicons name="flag-outline" size={30} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t('report.title')}</Text>
          <Text style={[styles.message, { color: colors.textLight }]}>{t('report.message')}</Text>

          <View style={styles.list}>
            {reasons.map((reason) => {
              const selected = selectedReason === reason.key;
              return (
                <AnimatedPressable
                  key={reason.key}
                  style={[styles.reasonRow, { borderColor: colors.border }]}
                  pressableStyle={[
                    styles.reasonRowInner,
                    { backgroundColor: selected ? colors.tertiary : 'transparent' },
                  ]}
                  onPress={() => setSelectedReason(reason.key)}
                  scaleValue={0.98}
                  disabled={submitting}
                >
                  <View
                    style={[
                      styles.radio,
                      { borderColor: selected ? colors.primary : colors.border },
                      selected && { backgroundColor: colors.primary },
                    ]}
                  >
                    {selected && <Ionicons name="checkmark" size={14} color={colors.background} />}
                  </View>
                  <Text style={[styles.reasonText, { color: colors.text }]}>{reason.label}</Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <AnimatedPressable
              style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onClose}
              scaleValue={0.96}
              disabled={submitting}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>{t('common.cancel')}</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={[
                styles.actionButton,
                styles.confirmButton,
                { backgroundColor: colors.primary, opacity: canSubmit ? 1 : 0.6 },
              ]}
              onPress={() => selectedReason && onSubmit(selectedReason)}
              scaleValue={0.96}
              disabled={!canSubmit}
            >
              <Text style={[styles.confirmText, { color: colors.background }]}>{t('report.submit')}</Text>
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    gap: 10,
    marginBottom: 18,
  },
  reasonRow: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  reasonRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    borderWidth: 0,
  },
  cancelText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  confirmText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
});

export default ReportReasonModal;
