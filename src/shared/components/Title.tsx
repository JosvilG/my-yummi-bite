import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

interface Props {
  children?: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

const Title: React.FC<Props> = ({ children, color, style }) => {
  const colors = useColors();
  const textColor = color ?? colors.background;

  return <Text style={[styles.title, { color: textColor }, style]}>{children}</Text>;
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
