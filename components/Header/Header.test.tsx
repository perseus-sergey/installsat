import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<Header />', () => {
  test('it should mount', () => {
    render(<Header lang={ELanguage.EN} />);

    const header = screen.getByTestId('Header');

    expect(header).toBeInTheDocument();
  });
});
