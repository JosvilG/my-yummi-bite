import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface Props {
  label: string;
  selected?: boolean;
  onSelect?: (label: string) => void;
  onDelete?: () => void;
}

const CategoryPill: React.FC<Props> = ({ label, selected = false, onSelect, onDelete }: Props) => {
  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => onSelect?.(label)} style={[styles.pill, selected && styles.pillSelected]}>
        <Text numberOfLines={1} style={[styles.text, selected && styles.textSelected]}>
          {label}
        </Text>
      </Pressable>
      {onDelete ? (
        <Pressable style={styles.delete} onPress={onDelete} hitSlop={10}>
          <Text style={styles.deleteText}>×</Text>
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
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 8,
  },
  pillSelected: {
    backgroundColor: COLORS.secondary,
  },
  text: {
    fontFamily: FONTS.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: COLORS.primary,
    fontSize: 13,
  },
  textSelected: {
    color: COLORS.background,
  },
  delete: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: COLORS.background,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});

export default CategoryPill;
