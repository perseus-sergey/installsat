import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FieldError from './FieldError';
import test, { describe } from 'node:test';
import { ECommentFormNames, EMPTY_FORM_STATE } from '@/models/comments.model';

describe('<FieldError />', () => {
  test('it should mount', () => {
    render(
      <FieldError
        formState={EMPTY_FORM_STATE}
        name={ECommentFormNames.AUTHOR}
      />
    );

    const fieldError = screen.getByTestId('FieldError');

    expect(fieldError).toBeInTheDocument();
  });
});
