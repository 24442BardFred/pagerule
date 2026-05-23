/**
 * pagerule — public API
 *
 * Re-exports all public utilities so consumers can import from a single
 * entry point:
 *
 *   import { paginate, buildPageUrl, buildPageUrls, buildPageRange } from 'pagerule';
 */

export { paginate } from './paginate';
export type { PaginateOptions, PaginationResult } from './paginate';

export { buildPageUrl, buildPageUrls } from './urlBuilder';
export type { UrlBuilderOptions } from './urlBuilder';

export { buildPageRange } from './pageRange';
export type { PageRangeOptions, PageRangeItem } from './pageRange';
