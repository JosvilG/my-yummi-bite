import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const FOOD_ICONS: { name: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { name: 'pizza-outline', color: COLORS.coral },
  { name: 'fast-food-outline', color: COLORS.accent },
  { name: 'cafe-outline', color: COLORS.peach },
  { name: 'ice-cream-outline', color: COLORS.secondary },
  { name: 'wine-outline', color: COLORS.primary },
  { name: 'fish-outline', color: COLORS.accent },
  { name: 'nutrition-outline', color: COLORS.coral },
  { name: 'leaf-outline', color: COLORS.teal },
];

const FoodParticle: React.FC<{ 
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  delay: number; 
  angle: number;
  distance: number;
}> = ({ icon, iconColor, delay, angle, distance }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const radians = (angle * Math.PI) / 180;
    const targetX = Math.cos(radians) * distance;
    const targetY = Math.sin(radians) * distance;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: targetX,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: targetY,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [opacity, scale, translateX, translateY, rotation, angle, distance, delay]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${angle > 180 ? -360 : 360}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: spin },
          ],
        },
      ]}
    >
      <Ionicons name={icon} size={28} color={iconColor} />
    </Animated.View>
  );
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  const logoBounce = useRef(new Animated.Value(0)).current;
  
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  
  const bgPulse = useRef(new Animated.Value(0)).current;

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
      ]),
      
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      
      Animated.sequence([
        Animated.timing(logoBounce, {
          toValue: -30,
          duration: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoBounce, {
          toValue: 0,
          duration: 150,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(logoBounce, {
          toValue: -15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(logoBounce, {
          toValue: 0,
          duration: 100,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
      
      Animated.delay(400),
      
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 15,
          duration: 500,
          easing: Easing.in(Easing.back(1)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotation, {
          toValue: 2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgPulse, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [logoScale, logoRotation, logoOpacity, logoBounce, glowScale, glowOpacity, bgPulse, shimmer, onFinish]);

  const spin = logoRotation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '360deg', '720deg'],
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const bgScale = bgPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.bgCircle, 
          styles.bgCircle1,
          { transform: [{ scale: bgScale }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.bgCircle, 
          styles.bgCircle2,
          { transform: [{ scale: bgScale }], opacity: bgPulse }
        ]} 
      />
      <Animated.View 
        style={[
          styles.bgCircle, 
          styles.bgCircle3,
          { transform: [{ scale: bgScale }] }
        ]} 
      />

      <View style={styles.particlesContainer}>
        {FOOD_ICONS.map((item, index) => (
          <FoodParticle
            key={index}
            icon={item.name}
            iconColor={item.color}
            delay={800 + index * 80}
            angle={index * 45}
            distance={140 + (index % 2) * 30}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { rotate: spin },
              { translateY: logoBounce },
            ],
          },
        ]}
      >
        <Image 
          source={require('@assets/Logo-MYB.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  bgCircle1: {
    width: SCREEN_WIDTH * 2,
    height: SCREEN_WIDTH * 2,
    backgroundColor: COLORS.coral,
    opacity: 0.4,
  },
  bgCircle2: {
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    backgroundColor: COLORS.peach,
    opacity: 0.5,
  },
  bgCircle3: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: COLORS.tertiary,
    opacity: 0.6,
  },
  particlesContainer: {
    position: 'absolute',
    width: 1,
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    fontSize: 32,
  },
  glow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 10,
    elevation: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  shimmer: {
    position: 'absolute',
    width: 100,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ rotate: '20deg' }],
  },
});

export default SplashScreen;
