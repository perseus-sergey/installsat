import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoUpLink from './GoUpLink';
import test, { describe } from 'node:test';

describe('<GoUpLink />', () => {
  test('it should mount', () => {
    render(<GoUpLink />);

    const goUpLink = screen.getByTestId('GoUpLink');

    expect(goUpLink).toBeInTheDocument();
  });
});
