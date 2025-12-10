import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

interface Props {
  children?: React.ReactNode;
}

const InfoTag: React.FC<Props> = ({ children }) => {
  const colors = useColors();

  if (!children) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.primary }]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  text: {
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    fontSize: 12,
  },
});

export default InfoTag;
