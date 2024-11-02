import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ArticleCard from './ArticleCard';
import test, { describe } from 'node:test';
import { DEFAULT_LANG } from '@/models/language.model';

describe('<ArticleCard />', () => {
  test('it should mount', () => {
    render(
      <ArticleCard
        lang={DEFAULT_LANG}
        seoCardLinkTitle="seoCardLinkTitle"
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
