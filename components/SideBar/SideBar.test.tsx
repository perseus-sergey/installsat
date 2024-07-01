import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SideBar from './SideBar';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<SideBar />', () => {
  test('it should mount', () => {
    render(<SideBar lang={ELanguage.EN} />);

    const sideBar = screen.getByTestId('SideBar');

    expect(sideBar).toBeInTheDocument();
  });
});
