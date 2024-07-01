import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WidgetLastNews from './WidgetLastNews';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<WidgetLastNews />', () => {
  test('it should mount', () => {
    render(<WidgetLastNews lang={ELanguage.EN} />);

    const widgetLastNews = screen.getByTestId('WidgetLastNews');

    expect(widgetLastNews).toBeInTheDocument();
  });
});
