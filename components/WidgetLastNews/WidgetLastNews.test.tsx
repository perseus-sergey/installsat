import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WidgetLastNews from './WidgetLastNews';
import test, { describe } from 'node:test';

describe('<WidgetLastNews />', () => {
  test('it should mount', () => {
    render(<WidgetLastNews />);

    const widgetLastNews = screen.getByTestId('WidgetLastNews');

    expect(widgetLastNews).toBeInTheDocument();
  });
});
