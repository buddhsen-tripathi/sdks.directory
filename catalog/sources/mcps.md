# MCP discovery sources

**Date:** 2026-07-27  
**Vertical:** `/mcps` on sdks.directory  
**Goal:** Systematically list Model Context Protocol servers for agents

---

## Tier 1 — start here

### Official MCP Registry

| | |
| --- | --- |
| **URL** | https://registry.modelcontextprotocol.io |
| **About** | https://modelcontextprotocol.io/registry/about |
| **Blog** | https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/ |
| **GitHub** | https://github.com/modelcontextprotocol/registry |
| **OpenAPI** | https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml |

**API (preview — may break before GA):**

```bash
curl "https://registry.modelcontextprotocol.io/v0.1/servers?limit=100"
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=filesystem&version=latest"
```

Useful query params: `limit`, cursor pagination (`metadata.nextCursor`), `search`, `version=latest`, `updated_since`, `include_deleted`.

**Why high value:** Authoritative publish-once metadata; designed for clients and **sub-registries** (we should be a curated sub-view, not a raw dump). MIT-licensed project.

**Ingest:** Paginate `/v0.1/servers?version=latest` → normalize to catalog shape (`kind: "mcp"`, name, description, remotes, repo URL, status). Sample saved as [`mcp-registry-sample.json`](mcp-registry-sample.json).

---

## Tier 2 — community / product registries

| Source | URL | Notes | Usefulness |
|--------|-----|-------|------------|
| PulseMCP | https://www.pulsemcp.com | Directory + involved in official registry | High |
| Glama MCP | https://glama.ai/mcp | Browse/search servers | High |
| Smithery | https://smithery.ai | Installable MCP catalog | High |
| mcp.so | https://mcp.so | Community directory | Medium |
| Official servers org | https://github.com/modelcontextprotocol/servers | Reference implementations | High (seed quality) |
| Awesome MCP lists | GitHub `awesome-mcp-servers` topic | Coverage uneven; good for gaps | Medium |

---

## Tier 3 — package / skill adjacent

| Source | URL | Notes |
|--------|-----|-------|
| npm | search `mcp-server` / `@modelcontextprotocol` | Many Node MCP servers |
| PyPI | `mcp` related packages | Python servers |
| skills.sh | `mcp-builder` etc. | Skills for *building* MCPs, not the servers themselves |
| Anthropic mcp-builder skill | https://github.com/anthropics/skills/tree/main/skills/mcp-builder | Copied under `catalog/skills/mcp/` |

---

## Recommended ingest strategy

1. **Nightly sync** from official registry API (`updated_since` when available).
2. **Dedupe** by registry `name` / DNS-verified namespace.
3. **Curate** featured / security-reviewed subset for the UI (full dump stays in research DB later).
4. **Link skills** when a server has an associated `SKILL.md` (rare today; more common for builders).
5. Treat marketplace “plugins that bundle MCP” as **plugins**, with a relation to MCP entries.

## Gaps

- Preview registry may reset; pin schema version.
- Quality/spam — rely on registry status + our denylist.
- Remote vs stdio install configs need careful agent-facing presentation.
