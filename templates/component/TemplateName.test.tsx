import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TemplateName from './TemplateName';
import test, { describe } from 'node:test';

describe('<TemplateName />', () => {
  test('it should mount', () => {
    render(<TemplateName>TemplateName</TemplateName>);

    const templateName = screen.getByTestId('TemplateName');

    expect(templateName).toBeInTheDocument();
  });
});
