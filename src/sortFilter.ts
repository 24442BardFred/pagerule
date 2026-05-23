/**
 * sortFilter.ts
 * Utilities for sorting and filtering paginated item collections
 * before pagination is applied.
 */

export type SortOrder = 'asc' | 'desc';

export interface SortOptions<T> {
  key: keyof T;
  order?: SortOrder;
}

export interface FilterOptions<T> {
  predicate: (item: T) => boolean;
}

/**
 * Sorts an array of items by a given key.
 */
export function sortItems<T>(items: T[], options: SortOptions<T>): T[] {
  const { key, order = 'asc' } = options;
  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal === bVal) return 0;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filters an array of items using a predicate function.
 */
export function filterItems<T>(items: T[], options: FilterOptions<T>): T[] {
  return items.filter(options.predicate);
}

/**
 * Applies sorting and/or filtering to an array of items.
 * Filter is applied before sort.
 */
export function preparePaginationItems<T>(
  items: T[],
  options: {
    sort?: SortOptions<T>;
    filter?: FilterOptions<T>;
  } = {}
): T[] {
  let result = items;

  if (options.filter) {
    result = filterItems(result, options.filter);
  }

  if (options.sort) {
    result = sortItems(result, options.sort);
  }

  return result;
}
