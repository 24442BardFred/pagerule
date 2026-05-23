// Core pagination
export { paginate, paginateAll } from './paginate';

// URL utilities
export { buildPageUrl, buildPageUrls } from './urlBuilder';

// Page range
export { buildPageRange } from './pageRange';

// Page metadata
export { buildPageMetadata } from './pageMetadata';

// Sort & filter
export { sortItems, filterItems, preparePaginationItems } from './sortFilter';

// Config
export { resolveConfig } from './paginationConfig';

// Window, navigator, slice
export { buildPageWindow } from './pageWindow';
export { buildPageNavigator } from './pageNavigator';
export { buildPageSlice } from './pageSlice';

// Serialization & output
export { serializePage, serializePages } from './pageSerializer';
export { toJson, toFrontmatter, toContext, formatPage } from './pageOutput';

// Template
export { applyTemplate, buildTemplateTokens } from './pageTemplate';

// Cursor
export { encodeCursor, decodeCursor, buildPageCursor } from './pageCursor';

// Cache
export { createPageCache } from './pageCache';

// Events & hooks
export { createPageEventEmitter } from './pageEvent';
export { createPageHooks } from './pageHooks';

// Validation
export { validateConfig } from './pageValidator';

// Links
export { buildPageLinks, serializeLinksHeader } from './pageLinks';

// Search
export * from './pageSearch';

// Grouping
export { groupItems, groupMapToPages, getGroupKeys } from './pageGrouping';

// Summary
export { buildPageSummary, formatPageSummary } from './pageSummary';

// Diff & History
export { diffPageStates, hasSignificantChange, summarizeDiff } from './pageDiff';
export { createPageHistory } from './pageHistory';
export type { PageDiffResult, PageDiffState } from './pageDiff';
export type { PageHistory } from './pageHistory';
