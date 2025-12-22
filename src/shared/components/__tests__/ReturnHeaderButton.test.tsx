import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import ReturnHeaderButton from '../ReturnHeaderButton';
import { Ionicons } from '@expo/vector-icons';

describe('ReturnHeaderButton', () => {
  it('renders correctly', () => {
    render(<ReturnHeaderButton />);
    // Check if Ionicons is rendered (Expo vector icons usually render as text or view with specific props)
    // Note: We might not see the specific icon name in test output depending on how jest-expo mocks it.
    // Ideally we check if pressing works.
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<ReturnHeaderButton onPress={onPressMock} />);
    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
