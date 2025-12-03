import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '@/features/auth/screens/LogInScreen';
import SignUpScreen from '@/features/auth/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="LogIn"
    >
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
