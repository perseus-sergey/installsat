import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Accordion from './Accordion';
import test, { describe } from 'node:test';
import { ELanguage } from '@/models/ui.model';

describe('<Accordion />', () => {
  test('it should mount', () => {
    render(<Accordion lang={ELanguage.EN} />);

    const accordion = screen.getByTestId('Accordion');

    expect(accordion).toBeInTheDocument();
  });
});
