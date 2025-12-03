import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import CrossIcon from '@/shared/icons/cross';
import VerifyIcon from '@/shared/icons/verify';
import { COLORS } from '@/constants/theme';

const VerifyButton = ({ variant = 'accept', size = 64, onPress }) => {
  const isAccept = variant === 'accept';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        isAccept ? styles.accept : styles.reject,
      ]}
      hitSlop={10}
    >
      {isAccept ? <VerifyIcon size={size * 0.6} /> : <CrossIcon size={size * 0.6} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  accept: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  reject: {
    borderWidth: 2,
    borderColor: COLORS.error,
  },
});

export default VerifyButton;
