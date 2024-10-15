import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WidgetArticleCategories from './WidgetArticleCategories';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/language.model';

describe('<WidgetArticleCategories />', () => {
  test('it should mount', () => {
    render(<WidgetArticleCategories lang={ELanguage.EN} />);

    const widgetArticleCategories = screen.getByTestId(
      'WidgetArticleCategories'
    );

    expect(widgetArticleCategories).toBeInTheDocument();
  });
});
