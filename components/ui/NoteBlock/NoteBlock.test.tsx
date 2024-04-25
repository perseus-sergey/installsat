import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NoteBlock from './NoteBlock';
import test, { describe } from 'node:test';

describe('<NoteBlock />', () => {
  test('it should mount', () => {
    render(<NoteBlock noteTitle="Note">NoteBlock</NoteBlock>);

    const noteBlock = screen.getByTestId('NoteBlock');

    expect(noteBlock).toBeInTheDocument();
  });
});
