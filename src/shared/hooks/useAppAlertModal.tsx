import React, { useCallback, useMemo, useRef, useState } from 'react';
import AppAlertModal from '@/shared/components/AppAlertModal';

type Variant = 'primary' | 'destructive';

type ShowOptions = {
  title: string;
  message: string;
  iconName?: React.ComponentProps<typeof AppAlertModal>['iconName'];
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: Variant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

type ModalState = {
  visible: boolean;
  title: string;
  message: string;
  iconName?: React.ComponentProps<typeof AppAlertModal>['iconName'];
  confirmText: string;
  cancelText?: string;
  confirmVariant: Variant;
};

export const useAppAlertModal = () => {
  const [state, setState] = useState<ModalState>({
    visible: false,
    title: '',
    message: '',
    iconName: 'alert-circle-outline',
    confirmText: 'OK',
    cancelText: undefined,
    confirmVariant: 'primary',
  });

  const confirmHandlerRef = useRef<ShowOptions['onConfirm']>(undefined);
  const cancelHandlerRef = useRef<ShowOptions['onCancel']>(undefined);

  const hide = useCallback(() => {
    setState(current => ({ ...current, visible: false }));
  }, []);

  const show = useCallback((options: ShowOptions) => {
    confirmHandlerRef.current = options.onConfirm;
    cancelHandlerRef.current = options.onCancel;
    setState({
      visible: true,
      title: options.title,
      message: options.message,
      iconName: options.iconName ?? 'alert-circle-outline',
      confirmText: options.confirmText ?? 'OK',
      cancelText: options.cancelText,
      confirmVariant: options.confirmVariant ?? 'primary',
    });
  }, []);

  const showInfo = useCallback(
    (options: Omit<ShowOptions, 'cancelText' | 'confirmVariant'>) =>
      show({
        ...options,
        cancelText: undefined,
        confirmVariant: 'primary',
      }),
    [show]
  );

  const showConfirm = useCallback(
    (options: ShowOptions) =>
      show({
        ...options,
        confirmVariant: options.confirmVariant ?? 'destructive',
      }),
    [show]
  );

  const handleConfirm = useCallback(async () => {
    hide();
    await confirmHandlerRef.current?.();
  }, [hide]);

  const handleCancel = useCallback(async () => {
    hide();
    await cancelHandlerRef.current?.();
  }, [hide]);

  const modal = useMemo(
    () => (
      <AppAlertModal
        visible={state.visible}
        title={state.title}
        message={state.message}
        iconName={state.iconName}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        confirmVariant={state.confirmVariant}
        onConfirm={handleConfirm}
        onCancel={state.cancelText ? handleCancel : undefined}
      />
    ),
    [handleCancel, handleConfirm, state]
  );

  return { show, showInfo, showConfirm, hide, modal, visible: state.visible };
};
