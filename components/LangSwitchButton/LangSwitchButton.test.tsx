import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LangSwitchButton from './LangSwitchButton';
import test, { describe } from 'node:test';

describe('<LangSwitchButton />', () => {
  test('it should mount', () => {
    render(<LangSwitchButton />);

    const langSwitchButton = screen.getByTestId('LangSwitchButton');

    expect(langSwitchButton).toBeInTheDocument();
  });
});
