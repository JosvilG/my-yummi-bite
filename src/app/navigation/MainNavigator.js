import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeIcon from '@/shared/icons/homeIcon';
import LargeChef from '@/shared/icons/largeChef';
import Add from '@/shared/icons/add';
import ProfileIcon from '@/shared/icons/profile';
import HomeScreen from '@/features/recipes/screens/HomeScreen';
import SaveScreen from '@/features/recipes/screens/SaveScreen';
import AddScreen from '@/features/recipes/screens/AddScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import InfoScreen from '@/features/recipes/screens/InfoScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Save"
        component={SaveScreen}
        options={{
          tabBarIcon: ({ focused }) => <LargeChef focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: ({ focused }) => <Add focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNav" component={TabNavigator} />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
