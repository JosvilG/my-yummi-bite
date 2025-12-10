import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

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
  const colors = useColors();
  
  const translatedLabel = t(getCuisineTranslationKey(label), { defaultValue: label });

  return (
    <Pressable
      onPress={() => onToggle(label)}
      style={[
        styles.pill, 
        selected 
          ? { backgroundColor: colors.primary } 
          : { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.primary }
      ]}
    >
      <Text style={[
        styles.text, 
        { color: selected ? colors.background : colors.primary }
      ]}>
        {translatedLabel}
      </Text>
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
  text: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});

export default FilterPill;
