import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserWelcome from './UserWelcome';
import test, { describe } from 'node:test';

describe('<UserWelcome />', () => {
  test('it should mount', () => {
    render(<UserWelcome />);

    const userWelcome = screen.getByTestId('UserWelcome');

    expect(userWelcome).toBeInTheDocument();
  });
});
