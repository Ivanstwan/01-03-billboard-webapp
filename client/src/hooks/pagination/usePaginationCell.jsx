export const DOTS = '...';

// Hooks for generating Array for pagination cell
// e.g. of expected return [1, ..., 7, 8, 9, 10] or [1, ..., 4, 5, 6, ..., 10]

const range = (start, end) => {
  // console.log({ start, end }, '[range]');
  let length = end - start + 1;

  return Array.from({ length }, (_, idx) => idx + start);
};

const usePaginationCell = ({ totalPages, siblingCount = 1, currentPage }) => {
  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS

  const totalPageNumbers = siblingCount + 5;

  /*
        If the number of pages is less than numbers that will shown in pagination,
        return range [1, ...totalPages]
    */

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;
  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  /*
  We do not want to show dots if there is only one position left
  after/before the left/right page count as that would lead to a change if our Pagination
  component size which we do not want
  */

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
  console.log({
    leftSiblingIndex,
    rightSiblingIndex,
    shouldShowLeftDots,
    shouldShowRightDots,
  });

  if (!shouldShowLeftDots && shouldShowRightDots) {
    // let leftItemCount = 3 + 2 * siblingCount;

    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    // let rightItemCount = 3 + 2 * siblingCount;

    let rightItemCount = 2 + 2 * siblingCount;
    let rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex + 1, rightSiblingIndex + 1);

    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }
};

export default usePaginationCell;
