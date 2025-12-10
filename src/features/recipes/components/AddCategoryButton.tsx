import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddCategory from '@/shared/icons/addCategory';
import { useColors } from '@/shared/hooks/useColors';

const ICON_SIZE = 58;

const AddCategoryButton: React.FC = () => {
  const colors = useColors();

  return (
    <View style={[styles.circle, { backgroundColor: colors.background }]}>
      <AddCategory width={ICON_SIZE * 0.75} height={ICON_SIZE * 0.75} />
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AddCategoryButton;
