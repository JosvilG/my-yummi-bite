import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AnimatedPressable from '../AnimatedPressable';

describe('AnimatedPressable', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedPressable>
        <Text>Click Me</Text>
      </AnimatedPressable>
    );

    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(
      <AnimatedPressable onPress={onPressMock}>
        <Text>Button</Text>
      </AnimatedPressable>
    );

    const button = screen.getByText('Button');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies styles correctly', () => {
    const testStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <AnimatedPressable testID="animated-pressable" style={testStyle}>
        <Text>Styled</Text>
      </AnimatedPressable>
    );

    const element = getByTestId('animated-pressable');
    expect(element.props.style).toEqual(expect.objectContaining(testStyle));
  });
});
