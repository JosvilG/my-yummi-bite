import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import ReturnIcon from '../icons/returnIcon';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

const ReturnHeaderButton: React.FC<Props> = ({ onPress, style }) => {
  return (
    <Pressable style={[styles.wrapper, style]} onPress={onPress}>
      <View style={styles.container}>
        <ReturnIcon />
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

export default ReturnHeaderButton;
