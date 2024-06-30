import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TransNewsSingle from './TransNewsSingle';
import test, { describe } from 'node:test';
import { getTransNewsForSingleDay } from '@/controllers/satDigest.controller';
import { ELanguage } from '@/models/ui.model';

describe('<TransNewsSingle />', async () => {
  const newsDate = '2024-02-02';
  const newsArray = await getTransNewsForSingleDay(newsDate);

  if (newsArray! instanceof Error) return;

  test('it should mount', () => {
    render(
      <TransNewsSingle
        lang={ELanguage.EN}
        newsArray={newsArray}
        title="TransNewsSingle Test"
      />
    );

    const transNewsSingle = screen.getByTestId('TransNewsSingle');

    expect(transNewsSingle).toBeInTheDocument();
  });
});
