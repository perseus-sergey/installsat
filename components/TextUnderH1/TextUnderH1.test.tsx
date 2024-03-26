import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextUnderH1 from './TextUnderH1';
import test, { describe } from 'node:test';

describe('<TextUnderH1 />', () => {
  test('it should mount', () => {
    render(<TextUnderH1>TextUnderH1</TextUnderH1>);

    const textUnderH1 = screen.getByTestId('TextUnderH1');

    expect(textUnderH1).toBeInTheDocument();
  });
});
