import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface Props {
  children?: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

const Title: React.FC<Props> = ({ children, color = COLORS.background, style }) => {
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
