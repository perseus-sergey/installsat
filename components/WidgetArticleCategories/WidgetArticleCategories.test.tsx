import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WidgetArticleCategories from './WidgetArticleCategories';
import test, { describe } from 'node:test';

describe('<WidgetArticleCategories />', () => {
  test('it should mount', () => {
    render(<WidgetArticleCategories />);

    const widgetArticleCategories = screen.getByTestId(
      'WidgetArticleCategories'
    );

    expect(widgetArticleCategories).toBeInTheDocument();
  });
});
