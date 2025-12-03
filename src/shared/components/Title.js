import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

const Title = ({ children, color = COLORS.background, style }) => {
  return <Text style={[styles.title, { color }, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.bold,
    fontSize: 42,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export default Title;
