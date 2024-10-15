import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FieldError from './FieldError';
import test, { describe } from 'node:test';
import { ECommentFormNames } from '@/models/ui/comments.model';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';

describe('<FieldError />', () => {
  test('it should mount', () => {
    render(
      <FieldError
        formState={EMPTY_FORM_STATE}
        name={ECommentFormNames.AUTHOR}
        errorFieldId="error-field-id"
      />
    );

    const fieldError = screen.getByTestId('FieldError');

    expect(fieldError).toBeInTheDocument();
  });
});
