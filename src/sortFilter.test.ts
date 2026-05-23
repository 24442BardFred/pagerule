import { sortItems, filterItems, preparePaginationItems } from './sortFilter';

interface TestItem {
  id: number;
  title: string;
  date: string;
}

const items: TestItem[] = [
  { id: 3, title: 'Banana', date: '2023-03-01' },
  { id: 1, title: 'Apple', date: '2023-01-15' },
  { id: 2, title: 'Cherry', date: '2023-02-10' },
];

describe('sortItems', () => {
  it('sorts by numeric key ascending', () => {
    const result = sortItems(items, { key: 'id', order: 'asc' });
    expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it('sorts by numeric key descending', () => {
    const result = sortItems(items, { key: 'id', order: 'desc' });
    expect(result.map((i) => i.id)).toEqual([3, 2, 1]);
  });

  it('sorts by string key ascending', () => {
    const result = sortItems(items, { key: 'title', order: 'asc' });
    expect(result.map((i) => i.title)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('sorts by string key descending', () => {
    const result = sortItems(items, { key: 'title', order: 'desc' });
    expect(result.map((i) => i.title)).toEqual(['Cherry', 'Banana', 'Apple']);
  });

  it('defaults to ascending order', () => {
    const result = sortItems(items, { key: 'id' });
    expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it('does not mutate the original array', () => {
    const original = [...items];
    sortItems(items, { key: 'id' });
    expect(items).toEqual(original);
  });
});

describe('filterItems', () => {
  it('filters items by predicate', () => {
    const result = filterItems(items, { predicate: (i) => i.id > 1 });
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual([3, 2]);
  });

  it('returns empty array when no items match', () => {
    const result = filterItems(items, { predicate: () => false });
    expect(result).toEqual([]);
  });
});

describe('preparePaginationItems', () => {
  it('applies filter then sort', () => {
    const result = preparePaginationItems(items, {
      filter: { predicate: (i) => i.id !== 2 },
      sort: { key: 'title', order: 'asc' },
    });
    expect(result.map((i) => i.title)).toEqual(['Apple', 'Banana']);
  });

  it('returns items unchanged when no options provided', () => {
    const result = preparePaginationItems(items);
    expect(result).toEqual(items);
  });

  it('applies only sort when no filter given', () => {
    const result = preparePaginationItems(items, { sort: { key: 'id', order: 'asc' } });
    expect(result.map((i) => i.id)).toEqual([1, 2, 3]);
  });
});
