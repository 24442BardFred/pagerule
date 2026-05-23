import {
  diffPageStates,
  hasSignificantChange,
  summarizeDiff,
  PageDiffState,
} from './pageDiff';

const makeState = (overrides: Partial<PageDiffState> = {}): PageDiffState => ({
  currentPage: 1,
  pageSize: 10,
  totalItems: 30,
  itemIds: [1, 2, 3],
  ...overrides,
});

describe('diffPageStates', () => {
  it('returns no changes when states are identical', () => {
    const state = makeState();
    const diff = diffPageStates(state, { ...state, itemIds: [...state.itemIds] });
    expect(diff.addedItems).toEqual([]);
    expect(diff.removedItems).toEqual([]);
    expect(diff.pageChanged).toBe(false);
    expect(diff.pageSizeChanged).toBe(false);
    expect(diff.totalChanged).toBe(false);
  });

  it('detects added items', () => {
    const prev = makeState({ itemIds: [1, 2] });
    const next = makeState({ itemIds: [1, 2, 3] });
    const diff = diffPageStates(prev, next);
    expect(diff.addedItems).toEqual([3]);
    expect(diff.removedItems).toEqual([]);
  });

  it('detects removed items', () => {
    const prev = makeState({ itemIds: [1, 2, 3] });
    const next = makeState({ itemIds: [1, 2] });
    const diff = diffPageStates(prev, next);
    expect(diff.removedItems).toEqual([3]);
    expect(diff.addedItems).toEqual([]);
  });

  it('detects page change', () => {
    const diff = diffPageStates(makeState({ currentPage: 1 }), makeState({ currentPage: 2 }));
    expect(diff.pageChanged).toBe(true);
  });

  it('detects page size change', () => {
    const diff = diffPageStates(makeState({ pageSize: 10 }), makeState({ pageSize: 20 }));
    expect(diff.pageSizeChanged).toBe(true);
  });

  it('detects total items change', () => {
    const diff = diffPageStates(makeState({ totalItems: 30 }), makeState({ totalItems: 60 }));
    expect(diff.totalChanged).toBe(true);
  });
});

describe('hasSignificantChange', () => {
  it('returns false when no changes', () => {
    const state = makeState();
    const diff = diffPageStates(state, { ...state, itemIds: [...state.itemIds] });
    expect(hasSignificantChange(diff)).toBe(false);
  });

  it('returns true when page changed', () => {
    const diff = diffPageStates(makeState({ currentPage: 1 }), makeState({ currentPage: 2 }));
    expect(hasSignificantChange(diff)).toBe(true);
  });
});

describe('summarizeDiff', () => {
  it('returns "no changes" for identical states', () => {
    const state = makeState();
    const diff = diffPageStates(state, { ...state, itemIds: [...state.itemIds] });
    expect(summarizeDiff(diff)).toBe('no changes');
  });

  it('includes all change descriptions', () => {
    const prev = makeState({ currentPage: 1, pageSize: 10, totalItems: 30, itemIds: [1, 2] });
    const next = makeState({ currentPage: 2, pageSize: 20, totalItems: 40, itemIds: [2, 3] });
    const summary = summarizeDiff(diffPageStates(prev, next));
    expect(summary).toContain('page changed');
    expect(summary).toContain('page size changed');
    expect(summary).toContain('total items changed');
    expect(summary).toContain('1 item(s) added');
    expect(summary).toContain('1 item(s) removed');
  });
});
