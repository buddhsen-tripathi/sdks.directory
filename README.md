# sdks.directory

Official SDKs, agent plugins, and MCP servers — indexed for humans and tools. Language is a filter, not the product.

Live: **SDKs**, **Plugins** (`/plugins`), and **MCPs** (`/mcps`) share one catalog entry shape.

## Why it exists

One place to look up client libraries, installable agent plugins, and Model Context Protocol servers — with an edge API that returns the same data the UI uses, including skill bodies.

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, Vite, React Router, Tailwind v4 |
| Motion | Motion (`motion/react`) for homepage reveals |
| Edge | Cloudflare Workers + static assets (SPA) |
| Catalog | Version-controlled TypeScript in `src/data/` |
| Package manager | Bun |

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
  data/              # SDKs, plugins, MCPs, languages, categories (+ SOURCES.md)
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
| [`src/data/sdks.ts`](src/data/sdks.ts) | SDK entries (optional `skills[]` for agent skill links) |
| [`src/data/plugins.ts`](src/data/plugins.ts) | Agent plugins (Claude / Cursor / Copilot) |
| [`src/data/mcps.ts`](src/data/mcps.ts) | Curated MCP servers |
| [`src/data/languages.ts`](src/data/languages.ts) | Language index |
| [`src/data/categories.ts`](src/data/categories.ts) | Category index |
| [`src/data/index.ts`](src/data/index.ts) | Search / featured helpers |
| [`src/data/SOURCES.md`](src/data/SOURCES.md) | Where to discover more SDKs / plugins / MCPs / skills |

Add or edit an entry in the matching data file, then open a PR. Types are in `src/types/catalog.ts`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home — search, featured SDKs / plugins / MCPs |
| `/browse` | Full SDK catalog with filters |
| `/search` | Search results |
| `/sdk/:slug` | SDK detail |
| `/plugins`, `/plugin/:slug` | Plugin catalog + detail |
| `/mcps`, `/mcp/:slug` | MCP catalog + detail |
| `/languages`, `/languages/:id` | Language filters |

## API

Same seed data as the SPA (Worker first for `/api/*`). Skill **bodies** are snapshotted so agents get full `SKILL.md` text from the API.

| Endpoint | Description |
|----------|-------------|
| `GET /api` | Agent discovery (endpoints + hints) |
| `GET /llms.txt` | Short agent instructions |
| `GET /api/health` | Health check |
| `GET /api/sdks` | List / filter (`?language=&category=&q=&withSkills=1&include=body`) |
| `GET /api/sdks/:slug` | Single SDK; pass `?include=body` for skill contents |
| `GET /api/plugins` | List / filter (`?category=&platform=&q=`) |
| `GET /api/plugins/:slug` | Single plugin |
| `GET /api/mcps` | List / filter (`?category=&q=`) |
| `GET /api/mcps/:slug` | Single MCP server |
| `GET /api/skills` | Flattened skills (`?sdk=&language=&q=&withContent=1&include=body`) |
| `GET /api/skills/:sdk/:name` | **Preferred** — single skill with `content` (full SKILL.md) |
| `GET /api/skills/:sdk/:name.md` | Raw markdown (`Accept: text/markdown` also works) |
| `GET /api/coverage` | Skills/packages/body coverage |
| `GET /api/languages` | Language index |
| `GET /api/categories` | Category index |

Refresh skill snapshots after linking new skills:

```bash
bun run sync:skills
```

## Roadmap

1. **SDKs** — curated seed, browse, search, detail
2. **Plugins** + **MCPs** directories (current)
3. Contribution flow and coverage checks
4. Deeper Official MCP Registry ingest
5. Optional D1-backed catalog (API stays stable)

## License

[MIT](LICENSE) © Buddhsen Tripathi
