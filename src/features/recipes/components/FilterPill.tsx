import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, FONTS } from '@/constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onToggle: (label: string) => void;
}

const getCuisineTranslationKey = (cuisine: string): string => {
  const key = cuisine.toLowerCase().replace(/\s+/g, '');
  return `filters.${key}`;
};

const FilterPill: React.FC<Props> = ({ label, selected, onToggle }: Props) => {
  const { t, i18n } = useTranslation();
  
  const translatedLabel = t(getCuisineTranslationKey(label), { defaultValue: label });

  return (
    <Pressable
      onPress={() => onToggle(label)}
      style={[styles.pill, selected ? styles.pillSelected : styles.pillDefault]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textDefault]}>{translatedLabel}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    marginHorizontal: 6,
    marginVertical: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    elevation: 2,
    maxHeight: 36,
  },
  pillDefault: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
  },
  text: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  textDefault: {
    color: COLORS.primary,
  },
  textSelected: {
    color: COLORS.background,
  },
});

export default FilterPill;
