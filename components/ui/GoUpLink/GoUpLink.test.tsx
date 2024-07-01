import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoUpLink from './GoUpLink';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<GoUpLink />', () => {
  test('it should mount', () => {
    render(<GoUpLink lang={ELanguage.EN} />);

    const goUpLink = screen.getByTestId('GoUpLink');

    expect(goUpLink).toBeInTheDocument();
  });
});
