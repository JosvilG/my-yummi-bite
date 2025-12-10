import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar, StyleSheet, View } from 'react-native';
import AppProviders from './src/app/providers/AppProviders';
import AppNavigator from './src/app/navigation/AppNavigator';
import SplashScreen from './src/shared/components/SplashScreen';

// Initialize i18n
import './src/i18n';
import { initializeLanguage } from './src/i18n/languageService';

const App: React.FC = () => {
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
  });

  // Initialize saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        await initializeLanguage();
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Continue with English as fallback
      } finally {
        setLanguageLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  // Show splash screen while loading
  if (!fontsLoaded || !languageLoaded || showSplash) {
    if (fontsLoaded && languageLoaded) {
      // Resources loaded, show animated splash
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }
    // Still loading resources, show simple splash
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#FF8A9B" />
      </View>
    );
  }

  return (
    <AppProviders>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </NavigationContainer>
    </AppProviders>
  );
};

export default App;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8A9B',
  },
});
