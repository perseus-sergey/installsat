import { IComments } from '@/components/comments2/CommentList/CommentList';

const useCommentNode = () => {
  const insertNode = function (
    tree: IComments,
    commentId: number,
    item: string
  ): IComments {
    if (tree.id === commentId) {
      tree.items.push({
        id: new Date().getTime(),
        name: item,
        items: [],
      });

      return tree;
    }

    let latestNode = [];
    latestNode = tree.items.map((ob) => {
      return insertNode(ob, commentId, item);
    });

    return { ...tree, items: latestNode };
  };

  const editNode = (tree: IComments, commentId: number, value: string) => {
    if (tree.id === commentId) {
      tree.name = value;

      return tree;
    }

    tree.items.map((ob) => {
      return editNode(ob, commentId, value);
    });

    return { ...tree };
  };

  const deleteNode = (tree: IComments, id: number) => {
    for (let i = 0; i < tree.items.length; i++) {
      const currentItem = tree.items[i];
      if (currentItem.id === id) {
        tree.items.splice(i, 1);

        return tree;
      } else {
        deleteNode(currentItem, id);
      }
    }

    return tree;
  };

  return { insertNode, editNode, deleteNode };
};

export default useCommentNode;
