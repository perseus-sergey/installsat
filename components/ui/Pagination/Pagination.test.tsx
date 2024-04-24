import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination from './Pagination';
import test, { describe } from 'node:test';

describe('<Pagination />', () => {
  test('it should mount', () => {
    render(
      <Pagination searchParams={{}} page={1} totalPages={5} offsetNumber={3} />
    );

    const pagination = screen.getByTestId('Pagination');

    expect(pagination).toBeInTheDocument();
  });
});
