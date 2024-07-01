import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateNewsList from './DateNewsList';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<DateNewsList />', () => {
  test('it should mount', () => {
    render(<DateNewsList lang={ELanguage.EN} />);

    const dateNewsList = screen.getByTestId('DateNewsList');

    expect(dateNewsList).toBeInTheDocument();
  });
});
