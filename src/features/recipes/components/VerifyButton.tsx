import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import CrossIcon from '@/shared/icons/cross';
import VerifyIcon from '@/shared/icons/verify';
import { useColors } from '@/shared/hooks/useColors';

type Variant = 'accept' | 'reject';

interface Props {
  variant?: Variant;
  size?: number;
  onPress?: () => void;
}

const VerifyButton: React.FC<Props> = ({ variant = 'accept', size = 64, onPress }: Props) => {
  const colors = useColors();
  const isAccept = variant === 'accept';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        { borderWidth: 2, borderColor: isAccept ? colors.success : colors.error },
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
});

export default VerifyButton;
