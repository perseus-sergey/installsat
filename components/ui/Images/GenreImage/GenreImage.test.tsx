import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GenreImage from './GenreImage';
import test, { describe } from 'node:test';

describe('<GenreImage />', () => {
  test('it should mount', () => {
    render(<GenreImage genreMapPosition={1} tooltipText="tooltipText" />);

    const genreImage = screen.getByTestId('GenreImage');

    expect(genreImage).toBeInTheDocument();
  });
});
