import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TooltipSimple from './TooltipSimple';
import test, { describe } from 'node:test';

describe('<TooltipSimple />', () => {
  test('it should mount', () => {
    render(
      <TooltipSimple tooltipText="Tooltip text">TooltipSimple</TooltipSimple>
    );

    const tooltipSimple = screen.getByTestId('TooltipSimple');

    expect(tooltipSimple).toBeInTheDocument();
  });
});
