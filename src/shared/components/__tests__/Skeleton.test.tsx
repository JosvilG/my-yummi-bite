import { render } from '@testing-library/react-native';
import Skeleton from '../Skeleton';

const mockUseColors = jest.fn(() => ({
  secondary: '#cccccc',
}));
jest.mock('@/shared/hooks/useColors', () => ({
  useColors: () => mockUseColors(),
}));

describe('Skeleton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const { toJSON } = render(<Skeleton width={100} height={50} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('applies custom style', () => {
    const { toJSON } = render(
      <Skeleton style={{ backgroundColor: 'red' }} />
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
