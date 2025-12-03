import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

const InfoTag = ({ children }) => {
  if (!children) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
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
    color: COLORS.primary,
  },
});

export default InfoTag;
