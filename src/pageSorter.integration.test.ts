/**
 * Integration: pageSorter + paginate
 * Verifies that sorted items feed correctly into the paginator.
 */
import { buildPageSorter } from './pageSorter';
import { paginate } from './paginate';

interface Post {
  id: number;
  title: string;
  publishedAt: Date;
}

const posts: Post[] = [
  { id: 3, title: 'Gamma', publishedAt: new Date('2024-03-01') },
  { id: 1, title: 'Alpha', publishedAt: new Date('2024-01-01') },
  { id: 4, title: 'Delta', publishedAt: new Date('2024-04-01') },
  { id: 2, title: 'Beta',  publishedAt: new Date('2024-02-01') },
  { id: 5, title: 'Epsilon', publishedAt: new Date('2024-05-01') },
];

describe('pageSorter + paginate integration', () => {
  it('paginates items in sorted order (newest first)', () => {
    const sorter = buildPageSorter<Post>({
      keys: [{ field: 'publishedAt', direction: 'desc' }],
    });
    const sorted = sorter(posts);
    const page = paginate(sorted, { page: 1, pageSize: 2, baseUrl: '/blog' });

    expect(page.items[0].title).toBe('Epsilon');
    expect(page.items[1].title).toBe('Delta');
    expect(page.totalItems).toBe(5);
    expect(page.totalPages).toBe(3);
  });

  it('returns correct second page after sort', () => {
    const sorter = buildPageSorter<Post>({
      keys: [{ field: 'title', direction: 'asc' }],
    });
    const sorted = sorter(posts);
    const page = paginate(sorted, { page: 2, pageSize: 2, baseUrl: '/blog' });

    expect(page.items[0].title).toBe('Beta');
    expect(page.items[1].title).toBe('Delta');
  });
});
