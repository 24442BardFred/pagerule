# pagerule

Configurable static-site pagination utility that integrates with existing build pipelines.

## Installation

```bash
npm install pagerule
```

## Usage

```typescript
import { paginate } from 'pagerule';

const pages = paginate({
  items: blogPosts,
  perPage: 10,
  basePath: '/blog',
});

// pages[0] => { items: [...], current: 1, total: 5, next: '/blog/2', prev: null }
pages.forEach((page) => {
  buildPage(page);
});
```

You can also configure custom URL patterns and output rules:

```typescript
import { createPager } from 'pagerule';

const pager = createPager({
  perPage: 5,
  urlPattern: '/posts/page/:num',
  firstPagePath: '/posts',
});

const result = pager.run(allPosts);
```

`pagerule` is build-tool agnostic — it works with Eleventy, custom scripts, or any Node.js-based pipeline.

## API

| Option          | Type     | Default        | Description                        |
|-----------------|----------|----------------|------------------------------------|
| `items`         | `array`  | —              | The full list of items to paginate |
| `perPage`       | `number` | `10`           | Number of items per page           |
| `basePath`      | `string` | `'/'`          | Base URL path for generated pages  |
| `firstPagePath` | `string` | `basePath`     | Override URL for the first page    |

## License

[MIT](./LICENSE)