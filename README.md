# sdks.directory

SDK catalog built for **AI agents** (and the humans who wire them up). Look up official client libraries by name, package, or vendor — language is a filter, not the product.

Live catalog today: **SDKs**. **Plugins** and **MCPs** share the same directory shape and ship next (`/plugins`, `/mcps`).

## Why it exists

Agents need reliable client libraries — auth, payments, models, databases, observability. This site indexes those SDKs in one place, with a small edge API so tools can query the same data the UI uses.

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, Vite, React Router, Tailwind v4 |
| Motion | Motion (`motion/react`) for homepage reveals |
| Edge | Cloudflare Workers + static assets (SPA) |
| Catalog | Version-controlled TypeScript in `src/data/` |
| Package manager | Bun |

## Site config

Central product config lives in [`src/config/site.ts`](src/config/site.ts):

- Site name, tagline, titles
- GitHub owner/repo
- Primary nav (`SDKs` / `Plugins` / `MCPs`)
- Theme storage key

Prefer importing from there instead of hardcoding strings in components.

## Develop

```bash
bun install
bun run dev
```

Open the Vite URL Wrangler prints (Worker + assets together).

```bash
bun run lint
bun run build
bun run preview   # production build locally
bun run deploy    # Cloudflare Workers
```

## Project layout

```
src/
  config/site.ts     # site-wide constants
  data/              # SDKs, languages, categories
  components/        # chrome, cards, grids
  pages/             # routes
  types/catalog.ts   # shared catalog types
worker/
  index.ts           # /api/* handlers
public/              # favicon and static assets
```

## Catalog data

| File | Role |
|------|------|
| [`src/data/sdks.ts`](src/data/sdks.ts) | SDK entries |
| [`src/data/languages.ts`](src/data/languages.ts) | Language index |
| [`src/data/categories.ts`](src/data/categories.ts) | Category index |
| [`src/data/index.ts`](src/data/index.ts) | Search / featured helpers |

Add or edit an SDK in `sdks.ts`, then open a PR. Types are in `src/types/catalog.ts`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home — search, featured SDKs, language filters |
| `/browse` | Full SDK catalog with filters |
| `/search` | Search results |
| `/sdk/:slug` | SDK detail |
| `/languages`, `/languages/:id` | Language filters |
| `/plugins`, `/mcps` | Coming soon |

## API

Same seed data as the SPA (Worker first for `/api/*`).

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/sdks` | List / filter (`?language=&category=&q=`) |
| `GET /api/sdks/:slug` | Single SDK |
| `GET /api/languages` | Language index |
| `GET /api/categories` | Category index |

## Roadmap

1. **SDKs** — curated seed, browse, search, detail (current)
2. Contribution flow and coverage checks
3. **Plugins** directory
4. **MCPs** directory
5. Optional D1-backed catalog (API stays stable)

## License

[MIT](LICENSE) © Buddhsen Tripathi
