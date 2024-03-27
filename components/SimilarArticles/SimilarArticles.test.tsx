import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SimilarArticles from './SimilarArticles';
import test, { describe } from 'node:test';

describe('<SimilarArticles />', () => {
  test('it should mount', () => {
    render(<SimilarArticles similarArticles={[]} />);

    const similarArticles = screen.getByTestId('SimilarArticles');

    expect(similarArticles).toBeInTheDocument();
  });
});
