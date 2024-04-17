import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CommentList from './CommentList';
import test, { describe } from 'node:test';

describe('<CommentList />', () => {
  test('it should mount', () => {
    render(<CommentList />);

    const commentList = screen.getByTestId('CommentList');

    expect(commentList).toBeInTheDocument();
  });
});
