# Data sources (how we expand `src/data/`)

Seed lives in this folder. Research should **update these files**, not invent parallel trees.

## SDKs (`sdks.ts`)

Prefer **one entry per vendor/product** with multi-registry `packages[]`.

| Priority | Source | Use |
|----------|--------|-----|
| 1 | Vendor `/sdks` / `/libraries` / docs hubs | Official signal |
| 2 | npm scopes/keywords, PyPI, Maven groupIds, pkg.go.dev | Language packages |
| 3 | libraries.io / deps.dev | Enrichment (downloads, repos) |

Avoid blind `*-sdk` dumps. Join languages via GitHub org + docs, not package-name equality.

## Agent skills (on each `SdkEntry.skills`)

Keep **refs** in `sdks.ts` (`name`, `url`, `install?`). Snapshot **bodies** into `skill-bodies.json` so `/api/skills/:sdk/:name` returns full `SKILL.md`.

```bash
bun run sync:skills   # resume-safe; prefers GitHub raw over skills.sh download
```

Do **not** vendor browsable skill trees under `catalog/` — the API snapshot is the agent delivery channel; `url` stays the attribution/source.

| Registry | URL |
|----------|-----|
| skills.sh | https://skills.sh · `npx skills find <q>` |
| Cloudflare | https://github.com/cloudflare/skills |
| Stripe | https://github.com/stripe/ai · https://docs.stripe.com/.well-known/skills/ |
| Neon | https://github.com/neondatabase/agent-skills |
| Prisma | https://github.com/prisma/skills |
| Supabase | https://github.com/supabase/agent-skills |
| Better Auth | https://github.com/better-auth/skills |
| Vercel AI SDK | https://skills.sh/vercel/ai/ai-sdk |

When adding an SDK, add `skills: [{ name, url, install? }]` if a public skill exists, then re-run `sync:skills`.

## MCPs (`mcps.ts`)

Canonical ingest: **Official MCP Registry**

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?limit=100&version=latest"
```

Docs: https://modelcontextprotocol.io/registry/about · OpenAPI in `modelcontextprotocol/registry`.

Curate into `mcps.ts` — prefer vendor-official servers. Enrich later: Glama, Smithery, Docker MCP Catalog. We are an aggregator/subregistry — not a raw dump.

## Plugins (`plugins.ts`)

Installable agent packages (skills + MCP + rules), not the dead 2023 ChatGPT plugin store.

| Source | URL |
|--------|-----|
| Cursor Marketplace | https://cursor.com/marketplace |
| Claude plugins | https://claude.com/plugins · `anthropics/claude-plugins-official` |
| skills.sh / SkillsMP | https://skills.sh · https://skillsmp.com |
| Copilot plugins | `github/awesome-copilot` marketplace.json |

Seed today is Claude official/partner plugins (`platforms: ["claude"]`). Add Cursor/Copilot entries with the matching platform tag.

## Contribute

1. Edit `sdks.ts`, `plugins.ts`, or `mcps.ts` in a PR.
2. Keep descriptions short and agent-usable.
3. Prefer package + docs + GitHub + install hints over marketing copy.
