import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SideBar from './SideBar';
import test, { describe } from 'node:test';

describe('<SideBar />', () => {
  test('it should mount', () => {
    render(<SideBar>SideBar</SideBar>);

    const sideBar = screen.getByTestId('SideBar');

    expect(sideBar).toBeInTheDocument();
  });
});
