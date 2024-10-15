import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TvScheduleLink from './TvScheduleLink';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/language.model';

describe('<TvScheduleLink />', () => {
  test('it should mount', () => {
    render(<TvScheduleLink lang={ELanguage.EN} href="#" title="Schedule" />);

    const tvScheduleLink = screen.getByTestId('TvScheduleLink');

    expect(tvScheduleLink).toBeInTheDocument();
  });
});
