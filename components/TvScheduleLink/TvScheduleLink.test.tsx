import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TvScheduleLink from './TvScheduleLink';
import test, { describe } from 'node:test';

describe('<TvScheduleLink />', () => {
  test('it should mount', () => {
    render(<TvScheduleLink href="#" title="Schedule" />);

    const tvScheduleLink = screen.getByTestId('TvScheduleLink');

    expect(tvScheduleLink).toBeInTheDocument();
  });
});
