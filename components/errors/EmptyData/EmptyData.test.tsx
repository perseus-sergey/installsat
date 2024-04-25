import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmptyData from './EmptyData';
import test, { describe } from 'node:test';

describe('<EmptyData />', () => {
  test('it should mount', () => {
    render(<EmptyData />);

    const emptyData = screen.getByTestId('EmptyData');

    expect(emptyData).toBeInTheDocument();
  });
});
