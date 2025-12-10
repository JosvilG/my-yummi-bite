import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

interface Props {
  label: string;
  selected?: boolean;
  onSelect?: (label: string) => void;
  onDelete?: () => void;
}

const CategoryPill: React.FC<Props> = ({ label, selected = false, onSelect, onDelete }: Props) => {
  const colors = useColors();

  return (
    <View style={styles.wrapper}>
      <Pressable 
        onPress={() => onSelect?.(label)} 
        style={[
          styles.pill, 
          { backgroundColor: colors.background, borderColor: colors.primary },
          selected && { backgroundColor: colors.secondary }
        ]}
      >
        <Text 
          numberOfLines={1} 
          style={[
            styles.text, 
            { color: colors.primary },
            selected && { color: colors.background }
          ]}
        >
          {label}
        </Text>
      </Pressable>
      {onDelete ? (
        <Pressable style={[styles.delete, { backgroundColor: colors.text }]} onPress={onDelete} hitSlop={10}>
          <Text style={[styles.deleteText, { color: colors.background }]}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 8,
    marginVertical: 10,
  },
  pill: {
    width: 100,
    height: 100,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 8,
  },
  text: {
    fontFamily: FONTS.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 13,
  },
  delete: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});

export default CategoryPill;
