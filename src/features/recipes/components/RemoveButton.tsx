import React from 'react';
import { View, StyleSheet } from 'react-native';
import RemoveCategory from '@/shared/icons/removeCategory';
import { useColors } from '@/shared/hooks/useColors';

const ICON_SIZE = 28;

const RemoveButton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={[styles.circle, { backgroundColor: colors.background }]}>
      <RemoveCategory width={ICON_SIZE * 0.7} height={ICON_SIZE * 0.7} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default RemoveButton;
