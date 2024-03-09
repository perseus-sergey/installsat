import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ESelectType, ReactSelect } from './ReactSelect';
import test, { describe } from 'node:test';

describe('<ReactSelect />', () => {
  test('it should mount', () => {
    render(<ReactSelect selectName={ESelectType.SELECT_SATS} />);

    const reactSelect = screen.getByTestId('ReactSelect');

    expect(reactSelect).toBeInTheDocument();
  });
});
