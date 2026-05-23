import { resolveConfig, PaginationConfig } from './paginationConfig';
import { preparePaginationItems } from './sortFilter';
import { buildPageMetadata, PageMetadata } from './pageMetadata';
import { buildPageSlice, PageSlice } from './pageSlice';
import { buildPageNavigator, PageNavigator } from './pageNavigator';
import { buildPageRange, PageRange } from './pageRange';

export type PaginationResult<T> = {
  metadata: PageMetadata;
  slice: PageSlice<T>;
  navigator: PageNavigator;
  range: PageRange;
};

/**
 * Paginates a list of items using the provided configuration.
 * Returns a single page result for the given page number.
 */
export function paginate<T>(
  items: T[],
  page: number,
  config: Partial<PaginationConfig<T>> = {}
): PaginationResult<T> {
  const resolved = resolveConfig(config);
  const prepared = preparePaginationItems(items, resolved);
  const metadata = buildPageMetadata(prepared.length, page, resolved.itemsPerPage);
  const slice = buildPageSlice(prepared, page, resolved.itemsPerPage);
  const navigator = buildPageNavigator(metadata, resolved.baseUrl, resolved.urlPattern);
  const range = buildPageRange(metadata.currentPage, metadata.totalPages, resolved.pageWindowSize);

  return { metadata, slice, navigator, range };
}

/**
 * Paginates a list of items and returns results for ALL pages.
 * Useful for static site generators that need to pre-render every page.
 */
export function paginateAll<T>(
  items: T[],
  config: Partial<PaginationConfig<T>> = {}
): PaginationResult<T>[] {
  const resolved = resolveConfig(config);
  const prepared = preparePaginationItems(items, resolved);
  const totalPages = Math.max(1, Math.ceil(prepared.length / resolved.itemsPerPage));

  return Array.from({ length: totalPages }, (_, i) =>
    paginate(items, i + 1, config)
  );
}
