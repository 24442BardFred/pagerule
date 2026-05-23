export interface PageProgressOptions {
  total: number;
  current: number;
  pageSize: number;
}

export interface PageProgress {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsOnCurrentPage: number;
  startItem: number;
  endItem: number;
  percentComplete: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function buildPageProgress(options: PageProgressOptions): PageProgress {
  const { total, current, pageSize } = options;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safeCurrent = Math.min(Math.max(1, current), totalPages);
  const startItem = total === 0 ? 0 : (safeCurrent - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrent * pageSize, total);
  const itemsOnCurrentPage = Math.max(0, endItem - startItem + (total > 0 ? 1 : 0));
  const percentComplete = totalPages === 0 ? 100 : Math.round((safeCurrent / totalPages) * 100);

  return {
    currentPage: safeCurrent,
    totalPages,
    totalItems: total,
    itemsOnCurrentPage,
    startItem,
    endItem,
    percentComplete,
    isFirstPage: safeCurrent === 1,
    isLastPage: safeCurrent === totalPages,
  };
}

export function formatPageProgress(progress: PageProgress): string {
  if (progress.totalItems === 0) {
    return "No items to display";
  }
  return `Page ${progress.currentPage} of ${progress.totalPages} — items ${progress.startItem}–${progress.endItem} of ${progress.totalItems} (${progress.percentComplete}%)`;
}
