interface IPageNumbers {
  offsetNumber: number;
  totalPages: number;
  currentPage: number;
}

export const getPageNumbers = ({
  offsetNumber,
  totalPages,
  currentPage,
}: IPageNumbers): number[] => {
  const pageNumbers = [];

  for (
    let i = currentPage - offsetNumber;
    i <= currentPage + offsetNumber;
    i += 1
  ) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers;
};
