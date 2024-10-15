export const getValidDate = (date: string | Date) => {
  const currDate = date instanceof Date ? date : new Date(date);

  return currDate.toString() === 'Invalid Date' ? null : currDate;
};

export const getFormattedDateStrYearFirst = (
  date: string | Date = new Date()
) => {
  const validDate = getValidDate(date);

  return !validDate
    ? ''
    : validDate.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
};
