import { render, fireEvent, screen } from '@testing-library/react-native';
import AppAlertModal from '../AppAlertModal';

const mockUseColors = jest.fn(() => ({
  background: '#ffffff',
  tertiary: '#f0f0f0',
  primary: '#0000ff',
  text: '#000000',
  textLight: '#888888',
  border: '#dddddd',
}));

jest.mock('@/shared/hooks/useColors', () => ({
  useColors: () => mockUseColors(),
}));

describe('AppAlertModal', () => {
  it('renders correctly when visible', () => {
    render(
      <AppAlertModal
        visible={true}
        title="Alert Title"
        message="Alert Message"
        confirmText="OK"
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('Alert Title')).toBeTruthy();
    expect(screen.getByText('Alert Message')).toBeTruthy();
    expect(screen.getByText('OK')).toBeTruthy();
  });

  it('calls onConfirm when confirm button is pressed', () => {
    const onConfirmMock = jest.fn();
    render(
      <AppAlertModal
        visible={true}
        title="Title"
        message="Message"
        confirmText="Confirm"
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.press(screen.getByText('Confirm'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('renders cancel button and calls onCancel', () => {
    const onCancelMock = jest.fn();
    render(
      <AppAlertModal
        visible={true}
        title="Title"
        message="Message"
        confirmText="OK"
        cancelText="Cancel"
        onConfirm={jest.fn()}
        onCancel={onCancelMock}
      />
    );

    expect(screen.getByText('Cancel')).toBeTruthy();
    fireEvent.press(screen.getByText('Cancel'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
