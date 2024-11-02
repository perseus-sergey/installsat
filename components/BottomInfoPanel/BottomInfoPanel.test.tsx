import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BottomInfoPanel from './BottomInfoPanel';
import test, { describe } from 'node:test';
import { DEFAULT_LANG } from '@/models/language.model';

describe('<BottomInfoPanel />', () => {
  test('it should mount', () => {
    render(<BottomInfoPanel lang={DEFAULT_LANG} items={[]} />);

    const bottomInfoPanel = screen.getByTestId('BottomInfoPanel');

    expect(bottomInfoPanel).toBeInTheDocument();
  });
});
