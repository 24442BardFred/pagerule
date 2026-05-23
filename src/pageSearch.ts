/**
 * pageSearch.ts
 * Provides search/filtering utilities for paginated item collections.
 */

export interface SearchOptions<T> {
  query: string;
  fields: (keyof T)[];
  caseSensitive?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  totalMatches: number;
  query: string;
}

/**
 * Searches items by matching a query string against specified fields.
 */
export function searchItems<T extends Record<string, unknown>>(
  items: T[],
  options: SearchOptions<T>
): SearchResult<T> {
  const { query, fields, caseSensitive = false } = options;

  if (!query || query.trim() === "") {
    return { items, totalMatches: items.length, query };
  }

  const normalizedQuery = caseSensitive ? query.trim() : query.trim().toLowerCase();

  const matched = items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      const strValue = String(value);
      const normalized = caseSensitive ? strValue : strValue.toLowerCase();
      return normalized.includes(normalizedQuery);
    })
  );

  return {
    items: matched,
    totalMatches: matched.length,
    query,
  };
}

/**
 * Builds a search predicate function for use with filterItems.
 */
export function buildSearchPredicate<T extends Record<string, unknown>>(
  options: SearchOptions<T>
): (item: T) => boolean {
  const { query, fields, caseSensitive = false } = options;
  if (!query || query.trim() === "") return () => true;

  const normalizedQuery = caseSensitive ? query.trim() : query.trim().toLowerCase();

  return (item: T) =>
    fields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      const strValue = String(value);
      const normalized = caseSensitive ? strValue : strValue.toLowerCase();
      return normalized.includes(normalizedQuery);
    });
}
