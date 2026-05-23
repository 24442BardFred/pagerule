/**
 * pageNavigator.ts
 * Builds navigation context (prev/next/first/last) for a paginated view.
 */

import { buildPageUrl } from "./urlBuilder";
import { buildPageWindow, PageWindowResult } from "./pageWindow";

export interface PageNavigatorOptions {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  urlSuffix?: string;
  windowSize?: number;
  showEdges?: boolean;
}

export interface PageNavigatorResult {
  currentPage: number;
  totalPages: number;
  prevUrl: string | null;
  nextUrl: string | null;
  firstUrl: string;
  lastUrl: string;
  window: PageWindowResult;
  pageUrls: (string | null)[];
}

/**
 * Builds a full navigation descriptor including URLs and page window.
 */
export function buildPageNavigator(options: PageNavigatorOptions): PageNavigatorResult {
  const { currentPage, totalPages, baseUrl, urlSuffix, windowSize, showEdges } = options;

  const prevUrl = currentPage > 1 ? buildPageUrl(baseUrl, currentPage - 1, urlSuffix) : null;
  const nextUrl = currentPage < totalPages ? buildPageUrl(baseUrl, currentPage + 1, urlSuffix) : null;
  const firstUrl = buildPageUrl(baseUrl, 1, urlSuffix);
  const lastUrl = buildPageUrl(baseUrl, totalPages, urlSuffix);

  const window = buildPageWindow({ currentPage, totalPages, windowSize, showEdges });

  const pageUrls = window.pages.map((p) =>
    p === null ? null : buildPageUrl(baseUrl, p, urlSuffix)
  );

  return { currentPage, totalPages, prevUrl, nextUrl, firstUrl, lastUrl, window, pageUrls };
}
