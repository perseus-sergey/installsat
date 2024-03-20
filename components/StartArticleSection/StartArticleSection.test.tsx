import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StartArticleSection from './StartArticleSection';
import test, { describe } from 'node:test';

describe('<StartArticleSection />', () => {
  test('it should mount', () => {
    render(<StartArticleSection>StartArticleSection</StartArticleSection>);

    const startArticleSection = screen.getByTestId('StartArticleSection');

    expect(startArticleSection).toBeInTheDocument();
  });
});
