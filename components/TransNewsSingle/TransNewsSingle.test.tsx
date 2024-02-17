import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TransNewsSingle from './TransNewsSingle';
import test, { describe } from 'node:test';
import {
  getTransNewsForSingleDay,
  singleDaySql,
} from '@/controllers/satDigest.controller';

describe('<TransNewsSingle />', async () => {
  const newsDate = '2024-02-02';
  const newsArray = await getTransNewsForSingleDay(newsDate, singleDaySql);

  test('it should mount', () => {
    render(
      <TransNewsSingle newsArray={newsArray} title="TransNewsSingle Test" />
    );

    const transNewsSingle = screen.getByTestId('TransNewsSingle');

    expect(transNewsSingle).toBeInTheDocument();
  });
});
