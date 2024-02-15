import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SatNewsList from './SatNewsList';
import test, { describe } from 'node:test';

describe('<SatNewsList />', () => {
  test('it should mount', () => {
    render(<SatNewsList urlParams={{ sat: '30' }} />);

    const satNewsList = screen.getByTestId('SatNewsList');

    expect(satNewsList).toBeInTheDocument();
  });
});
