# Contributing catalog data

## Add an SDK (primary path)

1. Copy the shape of an existing entry in [`src/data/sdks.ts`](../src/data/sdks.ts).
2. Required fields: `id`, `kind: "sdk"`, `name`, `slug`, `description`, `vendor`, `languages`, `categories`, `homepage`.
3. Strongly preferred: `docsUrl`, `githubUrl`, `packages[]` (registry + package name + URL), `official`, `tags`.
4. Open a PR. Keep descriptions short and agent-usable (what the client does, not marketing).

Optional template: [`submissions/sdk.example.json`](submissions/sdk.example.json).

## Add a skill for an SDK

Skills teach agents how to use a vendor/SDK correctly (`SKILL.md` + optional `references/`).

```
catalog/skills/<vendor-or-sdk-slug>/<skill-name>/
  SKILL.md      # required
  SOURCE.md     # required — where it came from + license notes
  references/   # optional
```

Then register it in [`skills/index.json`](skills/index.json) with `sdkSlugs` pointing at catalog entry slugs (e.g. `"cloudflare"`, `"neon"`, `"ai-sdk"`).

Do **not** paste proprietary docs wholesale. Prefer:

- Official public skill repos (link + copy with attribution)
- Your own original skill for the SDK
- Short excerpts with clear SOURCE provenance

## Add a listing source

Found a registry, awesome-list, or API that helps us discover SDKs / plugins / MCPs?

Add a section to the matching file under [`sources/`](sources/) or open a PR with:

- Name + URL
- What it covers
- API / scrape notes
- Why it helps agents

## Plugins & MCPs

Verticals are stubbed in the product (`/plugins`, `/mcps`). When data lands:

- Prefer the same contribution flow with `kind: "plugin" | "mcp"`
- MCP ingest should start from the [official MCP Registry](https://registry.modelcontextprotocol.io) API
