import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  pressableStyle?: StyleProp<ViewStyle>;
  scaleValue?: number;
  children: React.ReactNode;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  style,
  pressableStyle,
  scaleValue = 0.95,
  onPressIn,
  onPressOut,
  children,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(
    (event: any) => {
      Animated.spring(scaleAnim, {
        toValue: scaleValue,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
      onPressIn?.(event);
    },
    [scaleAnim, scaleValue, onPressIn]
  );

  const handlePressOut = useCallback(
    (event: any) => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
      onPressOut?.(event);
    },
    [scaleAnim, onPressOut]
  );

  return (
    <Pressable 
      style={style}
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut} 
      {...props}
    >
      <Animated.View style={[pressableStyle, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;
