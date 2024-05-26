import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CopyClipboard from './CopyClipboard';
import test, { describe } from 'node:test';

describe('<CopyClipboard />', () => {
  test('it should mount', () => {
    render(<CopyClipboard value="Copy" />);

    const copyClipboard = screen.getByTestId('CopyClipboard');

    expect(copyClipboard).toBeInTheDocument();
  });
});
