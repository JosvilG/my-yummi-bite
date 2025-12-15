import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/shared/components/AnimatedPressable';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

type Variant = 'primary' | 'destructive';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  confirmText: string;
  cancelText?: string;
  confirmVariant?: Variant;
  onConfirm: () => void;
  onCancel?: () => void;
};

const AppAlertModal: React.FC<Props> = ({
  visible,
  title,
  message,
  iconName = 'alert-circle-outline',
  confirmText,
  cancelText,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  const colors = useColors();
  const confirmColor = colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel ?? onConfirm}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.tertiary }]}>
            <Ionicons name={iconName} size={30} color={confirmColor} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textLight }]}>{message}</Text>

          <View style={styles.actions}>
            {cancelText ? (
              <>
                <AnimatedPressable
                  style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={onCancel}
                  scaleValue={0.96}
                >
                  <Text style={[styles.cancelText, { color: colors.text }]}>{cancelText}</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  style={[
                    styles.actionButton,
                    styles.confirmButton,
                    { backgroundColor: confirmColor },
                  ]}
                  onPress={onConfirm}
                  scaleValue={0.96}
                >
                  <Text style={[styles.confirmText, { color: colors.background }]}>{confirmText}</Text>
                </AnimatedPressable>
              </>
            ) : (
              <AnimatedPressable
                style={[styles.actionButton, styles.singleButton, { backgroundColor: confirmColor }]}
                onPress={onConfirm}
                scaleValue={0.96}
              >
                <Text style={[styles.confirmText, { color: colors.background }]}>{confirmText}</Text>
              </AnimatedPressable>
            )}
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
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    flex: 1,
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

export default AppAlertModal;
