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
declare module '*.otf';

declare module 'react-native-modal-selector';
declare module 'firebase/auth/react-native';

declare module 'react-native-deck-swiper' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export interface SwiperProps<T> {
    cards: T[];
    renderCard: (card: T, index: number) => React.ReactNode;
    onSwiped?: (cardIndex: number) => void;
    onSwipedLeft?: (cardIndex: number) => void;
    onSwipedRight?: (cardIndex: number) => void;
    onSwipedTop?: (cardIndex: number) => void;
    onSwipedBottom?: (cardIndex: number) => void;
    onSwipedAll?: () => void;
    cardIndex?: number;
    infinite?: boolean;
    horizontalSwipe?: boolean;
    verticalSwipe?: boolean;
    showSecondCard?: boolean;
    stackSize?: number;
    stackSeparation?: number;
    stackScale?: number;
    animateCardOpacity?: boolean;
    animateOverlayLabelsOpacity?: boolean;
    swipeBackCard?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    cardVerticalMargin?: number;
    cardHorizontalMargin?: number;
    marginTop?: number;
    marginBottom?: number;
    outputRotationRange?: string[];
    inputRotationRange?: number[];
    overlayLabels?: {
      left?: { title: string; style?: { label?: object; wrapper?: object } };
      right?: { title: string; style?: { label?: object; wrapper?: object } };
      top?: { title: string; style?: { label?: object; wrapper?: object } };
      bottom?: { title: string; style?: { label?: object; wrapper?: object } };
    };
    overlayOpacityHorizontalThreshold?: number;
    overlayOpacityVerticalThreshold?: number;
    disableBottomSwipe?: boolean;
    disableLeftSwipe?: boolean;
    disableRightSwipe?: boolean;
    disableTopSwipe?: boolean;
  }

  export default class Swiper<T> extends Component<SwiperProps<T>> {
    swipeLeft: (mustDecrementCardIndex?: boolean) => void;
    swipeRight: (mustDecrementCardIndex?: boolean) => void;
    swipeTop: (mustDecrementCardIndex?: boolean) => void;
    swipeBottom: (mustDecrementCardIndex?: boolean) => void;
    swipeBack: () => void;
    jumpToCardIndex: (cardIndex: number) => void;
  }
}

declare module '@/shared/icons/*' {
  import type { SvgProps } from 'react-native-svg';
  import React from 'react';
  const Component: React.FC<SvgProps & { focused?: boolean; size?: number; style?: any }>;
  export default Component;
}
