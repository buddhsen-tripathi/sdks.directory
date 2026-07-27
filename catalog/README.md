# Catalog research & contribution data

This folder is the **working store** for expanding sdks.directory beyond the hand-curated TypeScript seed in `src/data/`.

| Path | Purpose |
|------|---------|
| [`sources/`](sources/) | Research notes: where to discover SDKs, plugins, MCPs, and skills at scale |
| [`skills/`](skills/) | Agent `SKILL.md` files linked to catalog SDKs/vendors |
| [`submissions/`](submissions/) | Templates for proposing new catalog entries |

Runtime catalog consumed by the app remains in [`src/data/`](../src/data/). Over time, curated rows here (or generated JSON) can feed that seed.

## For contributors

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version:

1. Prefer a PR that adds/updates an entry under `src/data/sdks.ts` (or future plugins/mcps files).
2. If you have an agent skill for that SDK, drop it under `catalog/skills/<vendor>/<skill-name>/` with a `SOURCE.md`.
3. If you found a new listing source, add a note under `catalog/sources/`.

## Agent-first goal

Agents should be able to:

- Discover an SDK / plugin / MCP
- Load the matching skill (when we have one)
- Call the same data via `/api/*`
