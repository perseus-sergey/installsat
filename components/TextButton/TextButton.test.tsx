import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextButton from './TextButton';

describe('<TextButton />', () => {
  test('it should mount', () => {
    render(<TextButton />);
    
    const textButton = screen.getByTestId('TextButton');

    expect(textButton).toBeInTheDocument();
  });
});