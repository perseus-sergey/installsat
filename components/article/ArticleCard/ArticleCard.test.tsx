import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ArticleCard from './ArticleCard';
import test, { describe } from 'node:test';

describe('<ArticleCard />', () => {
  test('it should mount', () => {
    render(
      <ArticleCard
        articleDescription="articleDescription"
        articleTitle="articleTitle"
        image=""
        href="/"
        infoPanelItems={[]}
      />
    );

    const articleCard = screen.getByTestId('ArticleCard');

    expect(articleCard).toBeInTheDocument();
  });
});
