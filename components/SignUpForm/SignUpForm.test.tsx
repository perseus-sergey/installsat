import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignUpForm from './SignUpForm';
import test, { describe } from 'node:test';

describe('<SignUpForm />', () => {
  test('it should mount', () => {
    render(<SignUpForm />);

    const signUpForm = screen.getByTestId('SignUpForm');

    expect(signUpForm).toBeInTheDocument();
  });
});
