import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useAppAlertModal } from '../useAppAlertModal';

// Mock dependencies
jest.mock('@/shared/components/AppAlertModal', () => {
  const { View, Text } = require('react-native');
  return (props: any) => {
    if (!props.visible) return null;
    return (
      <View testID="mock-alert-modal">
        <Text>{props.title}</Text>
        <Text>{props.message}</Text>
        <Text onPress={props.onConfirm}>{props.confirmText}</Text>
        {props.cancelText && <Text onPress={props.onCancel}>{props.cancelText}</Text>}
      </View>
    );
  };
});

describe('useAppAlertModal', () => {
  it('initially hidden', () => {
    const { result } = renderHook(() => useAppAlertModal());
    expect(result.current.visible).toBe(false);
  });

  it('show updates state', () => {
    const { result } = renderHook(() => useAppAlertModal());
    
    act(() => {
      result.current.show({
        title: 'Test Title',
        message: 'Test Message',
        confirmText: 'Yes',
      });
    });

    expect(result.current.visible).toBe(true);
    // Note: testing internal state via result.current.modal might require rendering the modal
    // But we expose 'visible' in the return, so we can check that.
  });

  it('hide updates state', () => {
    const { result } = renderHook(() => useAppAlertModal());
    
    act(() => {
      result.current.show({ title: 'T', message: 'M' });
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      result.current.hide();
    });
    expect(result.current.visible).toBe(false);
  });
});
