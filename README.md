# Daily Veste

A React e-shop front-end for fashion, built with Vite, React, TypeScript and React Router. Product data comes from the public [DummyJSON](https://dummyjson.com/products) API.

## Features

- **Home**: a full-viewport image carousel, a sale banner and a "Featured Products" carousel (the first 5 women's and 5 men's clothing items, interleaved).
- **Carousel**: a reusable component with up to 5 visible items, arrows, pagination dots (a "N / M" counter on mobile), mouse drag and touch scroll, optional title, and an `image` or `product` variant.
- **Women / Men pages** (`/:gender/:category?`): category tabs (new, sale, clothing, dresses, tops, shoes, accessories, bags, jewellery, watches, sunglasses, sport, beauty). The tabs differ per gender.
- **Sale**: products with a discount of 10% or more get a `-X%` badge and show the sale price next to the struck-through original price. The Sale tab lists them.
- **Search** (`/search?q=`): matches product names, tags and category names. It is limited to clothing, accessories and sport. Focusing the input dims the page and suggests popular fashion tags.
- **Wishlist**: heart button on product cards and carousel items, header popover with total, "Remove all", and an undo toast. Persisted in `localStorage`.
- **UX**: loading skeletons, responsive layout (mobile header, 2-column grid, touch-friendly pagination), reduced-motion support.

## Getting started

```bash
npm install
npm run dev
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run images` | Convert images from `images-src` to `.webp` in `public/images` |
| `npm run images:men` / `images:women` | Rename source images with a `men` / `women` prefix, then convert them |

CSS is linted with Stylelint: `npx stylelint "src/**/*.css"`.

## Project structure

```
src/
├── app/          Router, Layout, WishlistProvider
├── components/   Header, SearchBar, WishlistPopover, WishlistButton, Toast,
│                 Carousel, Sale, ProductGrid, ProductListSkeleton
├── pages/        Home, ProductList, Search, NotFound (+ home-images.ts)
├── lib/          api.ts (DummyJSON), catalog.ts (categories, search, sale logic), wishlist.ts
├── index.css     Global variables and base styles
└── reset.css     CSS reset
```

Each component imports its own stylesheet (`Component.tsx` + `Component.css`).

## Data and catalog rules

DummyJSON has no gender field, so [catalog.ts](src/lib/catalog.ts) maps DummyJSON categories to the women/men tabs. Notes:

- DummyJSON `price` is the price **before** discount; the sale price is calculated from `discountPercentage`.
- The sale threshold is `SALE_THRESHOLD_PERCENT` in `catalog.ts`.
- To add a tab, add it to `CATALOG` and map it in `PRODUCT_CATEGORIES`.
