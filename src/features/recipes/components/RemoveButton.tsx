import React from 'react';
import { View, StyleSheet } from 'react-native';
import RemoveCategory from '@/shared/icons/removeCategory';
import { COLORS } from '@/constants/theme';

const ICON_SIZE = 28;

const RemoveButton: React.FC = () => {
  return (
    <View style={styles.circle}>
      <RemoveCategory width={ICON_SIZE * 0.7} height={ICON_SIZE * 0.7} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default RemoveButton;
