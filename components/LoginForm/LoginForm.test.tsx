import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './LoginForm';
import test, { describe } from 'node:test';

describe('<LoginForm />', () => {
  test('it should mount', () => {
    render(<LoginForm />);

    const loginForm = screen.getByTestId('LoginForm');

    expect(loginForm).toBeInTheDocument();
  });
});
