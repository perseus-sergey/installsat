import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ArticleList from './ArticleList';
import test, { describe } from 'node:test';

describe('<ArticleList />', () => {
  test('it should mount', () => {
    render(<ArticleList articleList={[]} articleTitleImg={''} />);

    const articleList = screen.getByTestId('ArticleList');

    expect(articleList).toBeInTheDocument();
  });
});
