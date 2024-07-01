import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmptyData from './EmptyData';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<EmptyData lang={lang} />', () => {
  test('it should mount', () => {
    render(<EmptyData lang={ELanguage.EN} />);

    const emptyData = screen.getByTestId('EmptyData');

    expect(emptyData).toBeInTheDocument();
  });
});
