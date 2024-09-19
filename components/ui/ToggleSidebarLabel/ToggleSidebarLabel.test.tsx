import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ToggleSidebarLabel from './ToggleSidebarLabel';
import test, { describe } from 'node:test';

describe('<ToggleSidebarLabel />', () => {
  test('it should mount', () => {
    render(
      <ToggleSidebarLabel ariaLabel="ToggleSidebarLabel">
        ToggleSidebarLabel
      </ToggleSidebarLabel>
    );

    const toggleSidebarLabel = screen.getByTestId('ToggleSidebarLabel');

    expect(toggleSidebarLabel).toBeInTheDocument();
  });
});
