import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import HomeScreen from '@/features/recipes/screens/HomeScreen';
import SaveScreen from '@/features/recipes/screens/SaveScreen';
import CreatePostScreen from '@/features/social/screens/CreatePostScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import RecipeDetailScreen from '@/features/recipes/screens/RecipeDetailScreen';
import PublishedRecipeDetailScreen from '@/features/social/screens/PublishedRecipeDetailScreen';
import type { MainStackParamList, TabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Save" component={SaveScreen} />
      <Tab.Screen name="Add" component={CreatePostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNav" component={TabNavigator} />
      <Stack.Screen
        name="Info"
        component={RecipeDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PublishedInfo"
        component={PublishedRecipeDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
