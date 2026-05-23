/**
 * pageSorter.ts
 * Multi-key, direction-aware sorter for paginated item collections.
 */

export type SortDirection = 'asc' | 'desc';

export interface SortKey<T> {
  field: keyof T;
  direction?: SortDirection;
}

export interface SorterOptions<T> {
  keys: SortKey<T>[];
  locale?: string;
  nullsLast?: boolean;
}

function compareValues(
  a: unknown,
  b: unknown,
  direction: SortDirection,
  locale: string,
  nullsLast: boolean
): number {
  if (a === null || a === undefined) return nullsLast ? 1 : -1;
  if (b === null || b === undefined) return nullsLast ? -1 : 1;

  let result = 0;
  if (typeof a === 'string' && typeof b === 'string') {
    result = a.localeCompare(b, locale);
  } else if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else if (a instanceof Date && b instanceof Date) {
    result = a.getTime() - b.getTime();
  } else {
    result = String(a).localeCompare(String(b), locale);
  }

  return direction === 'desc' ? -result : result;
}

export function buildPageSorter<T>(options: SorterOptions<T>): (items: T[]) => T[] {
  const { keys, locale = 'en', nullsLast = true } = options;

  return (items: T[]): T[] => {
    if (!keys.length) return [...items];

    return [...items].sort((a, b) => {
      for (const { field, direction = 'asc' } of keys) {
        const result = compareValues(a[field], b[field], direction, locale, nullsLast);
        if (result !== 0) return result;
      }
      return 0;
    });
  };
}

export function resolveSort<T>(items: T[], keys: SortKey<T>[]): T[] {
  return buildPageSorter<T>({ keys })(items);
}
