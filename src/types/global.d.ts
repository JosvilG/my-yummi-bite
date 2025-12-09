declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  import type { SvgProps } from 'react-native-svg';
  import React from 'react';
  const content: React.FC<SvgProps>;
  export default content;
}
declare module '*.ttf';
declare module 'react-native-modal-selector';
declare module '@/shared/icons/*' {
  declare module 'firebase/auth/react-native';
  // Additional module declarations can go here
  import React from 'react';
  const Component: React.FC<SvgProps & { focused?: boolean; size?: number; style?: any }>;
  export default Component;
}
