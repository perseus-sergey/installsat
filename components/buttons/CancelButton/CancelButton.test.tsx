import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CancelButton from './CancelButton';
import test, { describe } from 'node:test';

describe('<CancelButton />', () => {
  test('it should mount', () => {
    render(<CancelButton>CancelButton</CancelButton>);

    const cancelButton = screen.getByTestId('CancelButton');

    expect(cancelButton).toBeInTheDocument();
  });
});
