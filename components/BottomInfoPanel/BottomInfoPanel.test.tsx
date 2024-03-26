import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BottomInfoPanel from './BottomInfoPanel';
import test, { describe } from 'node:test';

describe('<BottomInfoPanel />', () => {
  test('it should mount', () => {
    render(<BottomInfoPanel items={[]} />);

    const bottomInfoPanel = screen.getByTestId('BottomInfoPanel');

    expect(bottomInfoPanel).toBeInTheDocument();
  });
});
