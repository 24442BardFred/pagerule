/**
 * pageHistory.ts
 * Tracks a history of pagination states and supports undo/redo navigation.
 */

import { PageDiffState } from './pageDiff';

export interface PageHistory {
  push(state: PageDiffState): void;
  back(): PageDiffState | undefined;
  forward(): PageDiffState | undefined;
  current(): PageDiffState | undefined;
  canGoBack(): boolean;
  canGoForward(): boolean;
  clear(): void;
  size(): number;
}

export function createPageHistory(maxSize = 50): PageHistory {
  const stack: PageDiffState[] = [];
  let cursor = -1;

  return {
    push(state: PageDiffState): void {
      // Discard forward history on new push
      stack.splice(cursor + 1);
      stack.push(state);
      if (stack.length > maxSize) {
        stack.shift();
      }
      cursor = stack.length - 1;
    },

    back(): PageDiffState | undefined {
      if (cursor <= 0) return undefined;
      cursor -= 1;
      return stack[cursor];
    },

    forward(): PageDiffState | undefined {
      if (cursor >= stack.length - 1) return undefined;
      cursor += 1;
      return stack[cursor];
    },

    current(): PageDiffState | undefined {
      return stack[cursor];
    },

    canGoBack(): boolean {
      return cursor > 0;
    },

    canGoForward(): boolean {
      return cursor < stack.length - 1;
    },

    clear(): void {
      stack.splice(0);
      cursor = -1;
    },

    size(): number {
      return stack.length;
    },
  };
}
