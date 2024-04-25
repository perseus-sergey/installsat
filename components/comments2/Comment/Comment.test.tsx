import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Comment from './Comment';
import test, { describe } from 'node:test';

describe('<Comment />', () => {
  test('it should mount', () => {
    render(
      <Comment
        handleDeleteNode={() => console.log('🚀 ~ test ~ handleDeleteNode')}
        handleEditNode={() => console.log('🚀 ~ test ~ handleEditNode')}
        handleInsertNode={() => console.log('🚀 ~ test ~ handleInsertNode')}
        comment={{ id: 1, name: 'comment', items: [] }}
      />
    );

    const comment = screen.getByTestId('Comment');

    expect(comment).toBeInTheDocument();
  });
});
