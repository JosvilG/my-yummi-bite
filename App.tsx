import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import AppProviders from './src/app/providers/AppProviders';
import AppNavigator from './src/app/navigation/AppNavigator';

// Initialize i18n
import './src/i18n';
import { initializeLanguage } from './src/i18n/languageService';

const App: React.FC = () => {
  const [languageLoaded, setLanguageLoaded] = useState(false);
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

  if (!fontsLoaded || !languageLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FC633A" />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
