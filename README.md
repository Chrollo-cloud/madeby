# MADEBY

MADEBY is an editorial-style creative marketplace for student-made work. It presents illustrations, prints, photography, objects, fashion, stickers, and digital products with an intentionally non-generic storefront experience.

## Features

- Five React Router pages: Home, Explore, Product Detail, Creator Profile, and Saved
- Search, category filtering, sorting, and responsive navigation
- Shared saved-products state with a dynamic navbar count
- Product stock states, add-to-cart feedback, and creator follow state
- Supplied visual assets organized in `public/images/products` and `public/images/creators`
- Fictional creator identities are used for all portrait demo assets

## React concepts used

- Reusable components and props (`ProductCard`, `CreatorCard`, and product grids)
- `useState` for exploration controls, cart feedback, following, and mobile navigation
- Context API and a custom `useMarketplace` hook for saved items
- Conditional rendering for stock, saved state, results, and empty states

## Tech stack

React, Vite, React Router, CSS.

## Project structure

```
src/
  components/       # Layout, product, creator, filter and shared UI
  context/          # Marketplace context
  data/             # Products, creators and categories
  hooks/            # Custom context hook
  pages/            # Route-level page components and styles
  utils/            # Formatting helpers
```

## Installation

```bash
npm install
npm run dev
```

## Deployment

Build with `npm run build`, then import the repository in Vercel. Vercel detects Vite automatically; use `npm run build` as the build command and `dist` as the output directory.
