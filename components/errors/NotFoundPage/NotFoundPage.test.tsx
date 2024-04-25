import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotFoundPage from './NotFoundPage';
import test, { describe } from 'node:test';

describe('<NotFoundPage />', () => {
  test('it should mount', () => {
    render(<NotFoundPage />);

    const notFoundPage = screen.getByTestId('NotFoundPage');

    expect(notFoundPage).toBeInTheDocument();
  });
});
