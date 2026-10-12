# Copilot instructions — react-eshop

Keep code, identifiers and comments in English. Be concise: show only the changed code, not whole files.

## Stack
- React 19 + TypeScript (strict project references: tsconfig.app.json / tsconfig.node.json), bundled with Vite.
- Routing: React Router v7. Import from `react-router` (not `react-router-dom`).
- Icons: `lucide-react`. Do not add another icon library.
- Styling: plain CSS files (`reset.css`, `index.css`, `App.css`). No Tailwind, no CSS-in-JS.
- ES modules (`"type": "module"`). No new dependency without asking first.

## Commands
- `npm run dev` — dev server
- `npm run build` — `tsc -b && vite build` (type errors fail the build)
- `npm run lint` — ESLint (flat config in `eslint.config.js`, with react-hooks and react-refresh plugins)
- CSS lint: `npx stylelint "src/**/*.css"` (stylelint-config-standard + recess-order)
- There is no test runner. Do not invent test files; run `npm run lint` and `npm run build` to validate changes.

## Structure (`src/`)
- `app/` — app shell: `Layout.tsx`, `router.tsx`, `WishlistProvider.tsx` (context provider)
- `pages/` — route components: `Home`, `ProductList`, `NotFound`
- `lib/` — non-UI logic: `api.ts`, `catalog.ts`, `wishlist.ts`
- `main.tsx` — entry point
- Ignore `dist/` and `node_modules/`.

## Conventions
- Function components with hooks only. One component per file, PascalCase file names for components, camelCase for `lib/` modules.
- Keep data fetching and business logic in `lib/`, not inside page components.
- New routes go in `app/router.tsx`; new pages in `pages/`.
- Respect `eslint-plugin-react-hooks` rules (dependency arrays, no conditional hooks) and react-refresh (components-only exports in component files).
- CSS properties must follow the recess-order sorting enforced by stylelint.
- Type everything explicitly at module boundaries; avoid `any`.

## Working style
- Before a multi-file change, state the plan in a few lines, then implement.
- Stop when the requested change is done. No unrelated refactors, no extra files.