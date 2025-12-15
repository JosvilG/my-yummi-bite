import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

export type CommonStackParamList = {
  Info: { id: number; rId?: string; source?: 'spoonacular' | 'custom' };
  PublishedInfo: { id: string };
  FollowingList: undefined;
  UserProfile: { userId: string };
};

export type HomeStackParamList = {
  Home: undefined;
} & CommonStackParamList;

export type SaveStackParamList = {
  Save: undefined;
} & CommonStackParamList;

export type AddStackParamList = {
  Add: undefined;
} & CommonStackParamList;

export type ProfileStackParamList = {
  Profile: undefined;
} & CommonStackParamList;

export type TabParamList = {
  Home: undefined;
  Save: undefined;
  Add: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: undefined;
};
