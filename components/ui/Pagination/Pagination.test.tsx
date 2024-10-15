import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination from './Pagination';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/language.model';

describe('<Pagination />', () => {
  test('it should mount', () => {
    render(
      <Pagination
        lang={ELanguage.EN}
        searchParams={{}}
        page={1}
        totalPages={5}
        offsetNumber={3}
      />
    );

    const pagination = screen.getByTestId('Pagination');

    expect(pagination).toBeInTheDocument();
  });
});
