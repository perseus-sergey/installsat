import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommentActionButton from './CommentActionButton';
import test, { describe } from 'node:test';

describe('<CommentActionButton />', () => {
  test('it should mount', () => {
    render(
      <CommentActionButton
        handleClick={() => console.log('CommentActionButton clicked')}
        type={'button'}
        className="className"
      />
    );

    const commentActionButton = screen.getByTestId('CommentActionButton');

    expect(commentActionButton).toBeInTheDocument();
  });
});
