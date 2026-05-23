/**
 * paginationConfig.ts
 * Defines and validates the global pagination configuration shape.
 */

import { SortOptions, FilterOptions } from './sortFilter';

export interface PaginationConfig<T = unknown> {
  /** Number of items per page */
  pageSize: number;
  /** Base URL pattern for page links (e.g. '/blog/page/:page') */
  baseUrl: string;
  /** Optional label for the first page URL (defaults to '1') */
  firstPageLabel?: string;
  /** Whether to generate a separate URL for page 1 or use baseUrl root */
  indexFirstPage?: boolean;
  /** Optional sort configuration applied before pagination */
  sort?: SortOptions<T>;
  /** Optional filter configuration applied before pagination */
  filter?: FilterOptions<T>;
}

export const DEFAULT_CONFIG: Partial<PaginationConfig> = {
  pageSize: 10,
  firstPageLabel: '1',
  indexFirstPage: false,
};

/**
 * Merges user-supplied config with defaults and validates required fields.
 */
export function resolveConfig<T>(
  config: Partial<PaginationConfig<T>> & Pick<PaginationConfig<T>, 'baseUrl'>
): PaginationConfig<T> {
  if (!config.baseUrl || config.baseUrl.trim() === '') {
    throw new Error('PaginationConfig: baseUrl is required and cannot be empty.');
  }

  const pageSize = config.pageSize ?? (DEFAULT_CONFIG.pageSize as number);
  if (pageSize < 1) {
    throw new Error('PaginationConfig: pageSize must be a positive integer.');
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
    pageSize,
  } as PaginationConfig<T>;
}
