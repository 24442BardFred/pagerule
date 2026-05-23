import { createPageHistory } from './pageHistory';
import { PageDiffState } from './pageDiff';

const makeState = (page: number): PageDiffState => ({
  currentPage: page,
  pageSize: 10,
  totalItems: 100,
  itemIds: [page],
});

describe('createPageHistory', () => {
  it('starts empty', () => {
    const history = createPageHistory();
    expect(history.size()).toBe(0);
    expect(history.current()).toBeUndefined();
  });

  it('pushes and retrieves current state', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    expect(history.current()?.currentPage).toBe(1);
    expect(history.size()).toBe(1);
  });

  it('navigates back correctly', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    history.push(makeState(2));
    const prev = history.back();
    expect(prev?.currentPage).toBe(1);
  });

  it('navigates forward correctly', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    history.push(makeState(2));
    history.back();
    const next = history.forward();
    expect(next?.currentPage).toBe(2);
  });

  it('returns undefined when cannot go back', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    expect(history.back()).toBeUndefined();
  });

  it('returns undefined when cannot go forward', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    expect(history.forward()).toBeUndefined();
  });

  it('discards forward history on new push', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    history.push(makeState(2));
    history.back();
    history.push(makeState(3));
    expect(history.canGoForward()).toBe(false);
    expect(history.current()?.currentPage).toBe(3);
  });

  it('respects maxSize limit', () => {
    const history = createPageHistory(3);
    history.push(makeState(1));
    history.push(makeState(2));
    history.push(makeState(3));
    history.push(makeState(4));
    expect(history.size()).toBe(3);
    expect(history.current()?.currentPage).toBe(4);
  });

  it('clears all history', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    history.push(makeState(2));
    history.clear();
    expect(history.size()).toBe(0);
    expect(history.current()).toBeUndefined();
    expect(history.canGoBack()).toBe(false);
  });

  it('reports canGoBack and canGoForward correctly', () => {
    const history = createPageHistory();
    history.push(makeState(1));
    history.push(makeState(2));
    expect(history.canGoBack()).toBe(true);
    expect(history.canGoForward()).toBe(false);
    history.back();
    expect(history.canGoBack()).toBe(false);
    expect(history.canGoForward()).toBe(true);
  });
});
