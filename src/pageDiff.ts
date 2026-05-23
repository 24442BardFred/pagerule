/**
 * pageDiff.ts
 * Utilities for computing differences between two pagination states.
 */

export interface PageDiffResult {
  addedItems: number[];
  removedItems: number[];
  pageChanged: boolean;
  pageSizeChanged: boolean;
  totalChanged: boolean;
}

export interface PageDiffState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemIds: number[];
}

export function diffPageStates(
  prev: PageDiffState,
  next: PageDiffState
): PageDiffResult {
  const prevSet = new Set(prev.itemIds);
  const nextSet = new Set(next.itemIds);

  const addedItems = next.itemIds.filter((id) => !prevSet.has(id));
  const removedItems = prev.itemIds.filter((id) => !nextSet.has(id));

  return {
    addedItems,
    removedItems,
    pageChanged: prev.currentPage !== next.currentPage,
    pageSizeChanged: prev.pageSize !== next.pageSize,
    totalChanged: prev.totalItems !== next.totalItems,
  };
}

export function hasSignificantChange(diff: PageDiffResult): boolean {
  return (
    diff.addedItems.length > 0 ||
    diff.removedItems.length > 0 ||
    diff.pageChanged ||
    diff.pageSizeChanged ||
    diff.totalChanged
  );
}

export function summarizeDiff(diff: PageDiffResult): string {
  const parts: string[] = [];
  if (diff.pageChanged) parts.push('page changed');
  if (diff.pageSizeChanged) parts.push('page size changed');
  if (diff.totalChanged) parts.push('total items changed');
  if (diff.addedItems.length > 0)
    parts.push(`${diff.addedItems.length} item(s) added`);
  if (diff.removedItems.length > 0)
    parts.push(`${diff.removedItems.length} item(s) removed`);
  return parts.length > 0 ? parts.join(', ') : 'no changes';
}
