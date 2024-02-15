import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateNewsList from './DateNewsList';
import test, { describe } from 'node:test';

describe('<DateNewsList />', () => {
  test('it should mount', () => {
    render(<DateNewsList />);

    const dateNewsList = screen.getByTestId('DateNewsList');

    expect(dateNewsList).toBeInTheDocument();
  });
});
