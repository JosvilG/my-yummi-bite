import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  iconColor?: string;
}

const ReturnHeaderButton: React.FC<Props> = ({ 
  onPress, 
  style, 
  backgroundColor = 'rgba(255,255,255,0.9)',
  iconColor = '#FF8A9B'
}) => {
  return (
    <Pressable style={[styles.wrapper, style]} onPress={onPress}>
      <View style={[styles.container, { backgroundColor }]}>
        <Ionicons name="chevron-back" size={22} color={iconColor} />
      </View>
    </Pressable>
  );
};

const SIZE = 36;

const styles = StyleSheet.create({
  wrapper: {
    margin: 12,
    alignSelf: 'flex-start',
  },
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default ReturnHeaderButton;
