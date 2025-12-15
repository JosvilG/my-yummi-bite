import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Home: undefined;
  Save: undefined;
  Add: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  TabNav: NavigatorScreenParams<TabParamList>;
  Info: { id: number; rId?: string; source?: 'spoonacular' | 'custom' };
  PublishedInfo: { id: string };
};

export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};
