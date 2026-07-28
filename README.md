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
  index.ts           # /api/* + agent discovery handlers
  catalog.ts         # search + MCP field enrichment
  mcp.ts             # catalog MCP (JSON-RPC)
  openapi.ts
  discovery.ts       # robots, llms, sitemap, well-known
  skills.ts          # skill body enrichment
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

Same seed data as the SPA (Worker first for `/api/*` and agent discovery files). Skill **bodies** are snapshotted so agents get full `SKILL.md` text from the API.

| Endpoint | Description |
|----------|-------------|
| `GET /api` | Agent discovery (endpoints + hints) |
| `GET /api/search?q=` | Unified search across SDKs, plugins, MCPs, skills |
| `GET /llms.txt` | Short agent instructions (also `/.well-known/llms.txt`) |
| `GET /openapi.json` | OpenAPI 3.1 description of the API |
| `GET /.well-known/api-catalog` | RFC 9727 API catalog (`application/linkset+json`) |
| `GET /.well-known/agent-skills/index.json` | Agent Skills discovery index |
| `GET /.well-known/mcp.json` | Catalog MCP server card |
| `GET /auth.md` | Auth policy (public API; no OAuth) |
| `POST /api/mcp` | Catalog MCP (JSON-RPC tools) |
| `GET /robots.txt` | Allows `/api/`, Content Signals, sitemap |
| `GET /sitemap.xml` | HTML + API resource sitemap |
| Homepage `Link` headers | RFC 8288 links to api-catalog, OpenAPI, llms.txt, skills index |
| `GET /api/health` | Health check |
| `GET /api/sdks` | List / filter (`?language=&category=&q=&withSkills=1&include=body`) |
| `GET /api/sdks/:slug` | Single SDK; `?view=agent` includes skill bodies |
| `GET /api/plugins` | List / filter (`?category=&platform=&q=`) |
| `GET /api/plugins/:slug` | Single plugin |
| `GET /api/mcps` | List / filter (`?category=&q=`) — includes `transport` / `auth` / `remoteUrl` when known |
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

Sitemap and robots are regenerated on every build (`bun run generate:sitemap`) into `public/` so crawlers get real XML even when the Worker is not first.

HTML catalog pages honor `Accept: text/markdown` (Markdown for Agents) with an `x-markdown-tokens` estimate. Cloudflare zone **Markdown for Agents** can also be enabled in AI Crawl Control for automatic HTML→Markdown conversion (Pro+).

### DNS for AI Discovery (DNS-AID)

DNS-AID cannot be shipped in the Worker; add Cloudflare DNS records for the zone, then enable DNSSEC:

```text
_index._agents.sdks.directory. 300 IN HTTPS 1 . alpn="h2,h3"
```

Point agents at the catalog via HTTPS/SVCB under `_agents` as in [draft-mozleywilliams-dnsop-dnsaid](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/).

### Auth / OAuth

The catalog API is public. There is no OAuth/OIDC authorization server and no protected-resource metadata on purpose. See `/auth.md`. Do not publish stub OAuth discovery documents.

## Roadmap

1. **SDKs** — curated seed, browse, search, detail
2. **Plugins** + **MCPs** directories
3. Agent discovery (search, OpenAPI, catalog MCP) — current
4. Contribution flow and coverage checks
5. Deeper Official MCP Registry ingest
6. Optional D1-backed catalog (API stays stable)

## License

[MIT](LICENSE) © Buddhsen Tripathi
