import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Fieldset from './Fieldset';
import test, { describe } from 'node:test';

describe('<Fieldset />', () => {
  test('it should mount', () => {
    render(<Fieldset legendText="Legend text">Fieldset</Fieldset>);

    const fieldset = screen.getByTestId('Fieldset');

    expect(fieldset).toBeInTheDocument();
  });
});
