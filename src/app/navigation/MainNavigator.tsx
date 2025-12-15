import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomTabBar from './CustomTabBar';
import HomeScreen from '@/features/recipes/screens/HomeScreen';
import SaveScreen from '@/features/recipes/screens/SaveScreen';
import CreatePostScreen from '@/features/social/screens/CreatePostScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import FollowingListScreen from '@/features/profile/screens/FollowingListScreen';
import UserProfileScreen from '@/features/profile/screens/UserProfileScreen';
import RecipeDetailScreen from '@/features/recipes/screens/RecipeDetailScreen';
import PublishedRecipeDetailScreen from '@/features/social/screens/PublishedRecipeDetailScreen';
import type {
  AddStackParamList,
  HomeStackParamList,
  ProfileStackParamList,
  SaveStackParamList,
  TabParamList,
} from '@/types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SaveStack = createNativeStackNavigator<SaveStackParamList>();
const AddStack = createNativeStackNavigator<AddStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const commonStackScreens = () => (
  <>
    <HomeStack.Screen name="Info" component={RecipeDetailScreen} />
    <HomeStack.Screen name="PublishedInfo" component={PublishedRecipeDetailScreen} />
    <HomeStack.Screen name="FollowingList" component={FollowingListScreen} />
    <HomeStack.Screen name="UserProfile" component={UserProfileScreen} />
  </>
);

const HomeStackNavigator: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    {commonStackScreens()}
  </HomeStack.Navigator>
);

const SaveStackNavigator: React.FC = () => (
  <SaveStack.Navigator screenOptions={{ headerShown: false }}>
    <SaveStack.Screen name="Save" component={SaveScreen} />
    <SaveStack.Screen name="Info" component={RecipeDetailScreen} />
    <SaveStack.Screen name="PublishedInfo" component={PublishedRecipeDetailScreen} />
    <SaveStack.Screen name="FollowingList" component={FollowingListScreen} />
    <SaveStack.Screen name="UserProfile" component={UserProfileScreen} />
  </SaveStack.Navigator>
);

const AddStackNavigator: React.FC = () => (
  <AddStack.Navigator screenOptions={{ headerShown: false }}>
    <AddStack.Screen name="Add" component={CreatePostScreen} />
    <AddStack.Screen name="Info" component={RecipeDetailScreen} />
    <AddStack.Screen name="PublishedInfo" component={PublishedRecipeDetailScreen} />
    <AddStack.Screen name="FollowingList" component={FollowingListScreen} />
    <AddStack.Screen name="UserProfile" component={UserProfileScreen} />
  </AddStack.Navigator>
);

const ProfileStackNavigator: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="Info" component={RecipeDetailScreen} />
    <ProfileStack.Screen name="PublishedInfo" component={PublishedRecipeDetailScreen} />
    <ProfileStack.Screen name="FollowingList" component={FollowingListScreen} />
    <ProfileStack.Screen name="UserProfile" component={UserProfileScreen} />
  </ProfileStack.Navigator>
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Save" component={SaveStackNavigator} />
      <Tab.Screen name="Add" component={AddStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
