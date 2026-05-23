/**
 * pageBreakpoint.ts
 * Utilities for computing responsive pagination breakpoints
 * based on viewport or container width constraints.
 */

export interface PageBreakpoint {
  name: string;
  minWidth: number;
  maxWidth: number;
  pageSize: number;
  windowSize: number;
}

export interface BreakpointResult {
  active: PageBreakpoint;
  pageSize: number;
  windowSize: number;
}

const DEFAULT_BREAKPOINTS: PageBreakpoint[] = [
  { name: "xs", minWidth: 0, maxWidth: 479, pageSize: 5, windowSize: 3 },
  { name: "sm", minWidth: 480, maxWidth: 767, pageSize: 10, windowSize: 5 },
  { name: "md", minWidth: 768, maxWidth: 1023, pageSize: 20, windowSize: 7 },
  { name: "lg", minWidth: 1024, maxWidth: 1279, pageSize: 25, windowSize: 9 },
  { name: "xl", minWidth: 1280, maxWidth: Infinity, pageSize: 50, windowSize: 11 },
];

export function resolveBreakpoint(
  width: number,
  breakpoints: PageBreakpoint[] = DEFAULT_BREAKPOINTS
): BreakpointResult {
  if (breakpoints.length === 0) {
    throw new Error("At least one breakpoint must be provided.");
  }

  const sorted = [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
  const active =
    sorted.find((bp) => width >= bp.minWidth && width <= bp.maxWidth) ??
    sorted[sorted.length - 1];

  return {
    active,
    pageSize: active.pageSize,
    windowSize: active.windowSize,
  };
}

export function buildBreakpointMap(
  breakpoints: PageBreakpoint[] = DEFAULT_BREAKPOINTS
): Record<string, PageBreakpoint> {
  return Object.fromEntries(breakpoints.map((bp) => [bp.name, bp]));
}

export function getDefaultBreakpoints(): PageBreakpoint[] {
  return [...DEFAULT_BREAKPOINTS];
}
