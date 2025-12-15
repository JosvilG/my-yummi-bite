import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColors } from '@/shared/hooks/useColors';
import { log } from '@/lib/logger';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  route: string;
  iconOutline: IconName;
  iconFilled: IconName;
}

const TAB_CONFIG: TabConfig[] = [
  { route: 'Home', iconOutline: 'home-outline', iconFilled: 'home' },
  { route: 'Save', iconOutline: 'search-outline', iconFilled: 'search' },
  { route: 'Add', iconOutline: 'share-social-outline', iconFilled: 'share-social' },
  { route: 'Profile', iconOutline: 'person-outline', iconFilled: 'person' },
];

interface TabButtonProps {
  isFocused: boolean;
  iconName: IconName;
  iconColor: string;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ isFocused, iconName, iconColor, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  }, [scaleAnim]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={[
        styles.tabBar, 
        { backgroundColor: colors.background, borderColor: colors.tertiary }
      ]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabConfig = TAB_CONFIG.find(t => t.route === route.name);
          
          if (!tabConfig) return null;

          const iconName = isFocused ? tabConfig.iconFilled : tabConfig.iconOutline;
          const iconColor = isFocused ? colors.primary : colors.textLight;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              log.info('Tab navigation', { from: state.routes[state.index].name, to: route.name });
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              isFocused={isFocused}
              iconName={iconName}
              iconColor={iconColor}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default CustomTabBar;
