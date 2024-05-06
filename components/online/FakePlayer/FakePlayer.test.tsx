import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FakePlayer from './FakePlayer';
import test, { describe } from 'node:test';

describe('<FakePlayer />', () => {
  test('it should mount', () => {
    render(<FakePlayer url="https://installsat.tv/" chanTitle="My Channel" />);

    const fakePlayer = screen.getByTestId('FakePlayer');

    expect(fakePlayer).toBeInTheDocument();
  });
});
