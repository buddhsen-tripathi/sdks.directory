# sdks.directory

Language-first catalog of SDKs. Find official and community client libraries by the language you ship in. Hosted on Cloudflare Workers.

Plugins and MCPs are planned next. Same directory shape, new verticals.

## Stack

- **Frontend:** React 19 + Vite + React Router
- **Edge:** Cloudflare Workers (static assets + `/api/*`)
- **Data:** Version-controlled TypeScript catalog in `src/data/` (reviewable PRs; D1 later)

## Develop

```bash
bun install
bun run dev
```

## Build & deploy

```bash
bun run build
bun run deploy
```

## Catalog

- Entries live in [`src/data/sdks.ts`](src/data/sdks.ts)
- Languages: [`src/data/languages.ts`](src/data/languages.ts)
- Categories: [`src/data/categories.ts`](src/data/categories.ts)

Each SDK lists the languages it supports. Browse `/languages/python`, `/languages/nodejs`, etc.

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/sdks` | List/filter (`?language=&category=&q=`) |
| `GET /api/sdks/:slug` | Single SDK |
| `GET /api/languages` | Language index |
| `GET /api/categories` | Category index |

## Roadmap

1. **SDKs** (current): curated seed + browse/search by language
2. Verify coverage & contribution flow
3. **Plugins** directory
4. **MCPs** directory
