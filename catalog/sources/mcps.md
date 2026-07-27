# MCP Server Discovery Sources — Research Notes (Jul 2026)

For an **agent-facing MCP vertical** on sdks.directory: treat the **official MCP Registry** as the canonical metadata backbone, then enrich from community indexes. Official docs explicitly position sites like yours as **aggregators / subregistries**.

---

## Recommended stack (priority)

| Priority | Source | Why |
|---|---|---|
| P0 | Official MCP Registry API | Canonical `server.json`, open API, designed for aggregators |
| P0 | `server.schema.json` + OpenAPI | Shared schema for your own catalog / subregistry |
| P1 | Glama API | Broad index + tool-level metadata, public HTTP API |
| P1 | Smithery Registry API | Verified/hosted servers, usage signals, SDK |
| P1 | PulseMCP (partner API) | Large curated index + enrichment; contact required |
| P2 | Docker MCP Catalog / `docker/mcp-registry` | High-quality containerized subset |
| P2 | GitHub awesome lists + topics | Coverage + long-tail discovery |
| P3 | npm / PyPI / GHCR | Package-level signals, not a clean registry |
| P3 | mcp.so, cursor.directory, mcpservers.org | UX/popularity; scrape or partner |

---

## 1. Official registries / directories

### Official MCP Registry
- **Name:** MCP Registry (preview → GA path)
- **URLs:**
  - API: https://registry.modelcontextprotocol.io
  - Live docs: https://registry.modelcontextprotocol.io/docs
  - Blog launch: https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/
  - About: https://modelcontextprotocol.io/registry/about
  - Aggregator guide: https://modelcontextprotocol.io/registry/registry-aggregators
  - Code: https://github.com/modelcontextprotocol/registry
- **Coverage / quality:** Official metadata directory for *public* MCP servers. Maintainers include Anthropic, GitHub, PulseMCP, Microsoft. Preview may still change; API v0.1 frozen for integrators. Quality = publisher self-description + moderation (spam/malware denylist), not deep security review.
- **API feasibility:** **Excellent (first-class).** Unauthenticated read API. Suggested poll ~hourly; persist locally; no uptime/durability SLA.
  - `GET /v0.1/servers` (cursor pagination, `updated_since`, `search`, `version=latest`)
  - `GET /v0.1/servers/{serverName}/versions`
  - `GET /v0.1/servers/{serverName}/versions/{version|latest}`
  - Staging: `https://staging.registry.modelcontextprotocol.io`
- **License / ToS:** OpenAPI/spec MIT. Registry open source; intended for aggregators. Host apps are told to prefer *downstream* marketplaces implementing the same OpenAPI (you *are* that layer).
- **Agent-dir usefulness:** **Highest.** Namespace DNS verification, install packages (npm/pypi/nuget/oci/mcpb), remotes, status (`active`/`deprecated`/`deleted`). Ideal seed + sync source.

### Official schemas & publisher tooling
- **server.json schema:** https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json  
  Docs: https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md  
  OpenAPI: https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml
- **Protocol schemas:** https://github.com/modelcontextprotocol/specification (`schema.ts` / `schema.json`)
- **Publish flow:** `mcpName` in npm `package.json` must match `server.json` `name`; publish via registry publisher tooling.

### modelcontextprotocol org reference repos
- **Servers (reference only):** https://github.com/modelcontextprotocol/servers — small set of reference implementations; README points discovery to the Registry.
- **Archived servers:** https://github.com/modelcontextprotocol/servers-archived
- **Usefulness:** Seed “official/reference” badges, not comprehensive coverage.

### Docker MCP Catalog / Registry
- **URLs:**
  - Catalog UI: https://hub.docker.com/mcp/
  - Docs: https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog
  - GitHub registry: https://github.com/docker/mcp-registry
  - Docker Hub `mcp` namespace: https://hub.docker.com/u/mcp (~245 repos observed via Hub API)
- **Coverage / quality:** Curated, containerized, often signed/verified — **smaller but higher trust** (~200–300+ catalog entries claimed).
- **API feasibility:** Hub API for `mcp` namespace; catalog metadata also in `docker/mcp-registry` repo (PR-based submissions).
- **License:** Per-server; Docker catalog contribution via GitHub. Apache common for Docker-built images.
- **Agent-dir usefulness:** Strong for “install via Docker” configs and security-minded agents.

### VS Code MCP Gallery
- **Docs:** https://code.visualstudio.com/docs/agent-customization/mcp-servers (`@mcp` in Extensions)
- **Implementation:** VS Code `mcpGalleryService` consumes registry-shaped manifests (npm/pypi/docker/nuget/remote/mcpb).
- **Usefulness:** Validates that Microsoft clients already consume official-registry-compatible metadata — good interoperability target for sdks.directory as a subregistry.

---

## 2. Community registries / directories

### Glama
- **URLs:** https://glama.ai/ · MCP browse: https://glama.ai/mcp · FAQ: https://glama.ai/mcp/faq
- **Coverage / quality:** Claims to index “every” MCP server (often cited 20k+); maintainer-verified rebuilds, quality/safety scores, tool schemas, hosting/gateway. Superset of official registry in practice.
- **API feasibility:** **Good public API.**
  - List/search: `GET https://glama.ai/api/mcp/v1/servers?query=&first=&after=`
  - Detail: `GET https://glama.ai/api/mcp/v1/servers/{namespace}/{slug}`
  - Verified HTTP 200; cursor pagination via `pageInfo`.
- **License / ToS:** Commercial product; check Glama terms before bulk redistribution. API appears openly readable today — still confirm rate limits / attribution.
- **Agent-dir usefulness:** **Very high** for tool-level search, health, and install snippets (Cursor/Claude/VS Code).

### Smithery
- **URLs:** https://smithery.ai/ · Docs: https://www.smithery.ai/docs/api-reference/servers/list-all-servers · SDK: https://github.com/smithery-ai/typescript-api
- **Coverage / quality:** Marketplace + hosting; ~**7.4k** servers via API (`totalCount`), UI often quotes 6k–13k+; verification, deploy status, use counts.
- **API feasibility:** **Good.**
  - Registry host observed: `https://registry.smithery.ai/servers` (HTTP 200, paginated)
  - Also Platform API / OpenAPI via docs; `@smithery/api` client; some write ops need `SMITHERY_API_KEY`.
- **License / ToS:** Platform ToS; redistributing their enriched metadata may need permission. Read listing OK for research; production sync → review terms.
- **Agent-dir usefulness:** High for hosted/remote MCPs, popularity (`useCount`), one-click agent connect patterns.

### PulseMCP
- **URLs:** https://www.pulsemcp.com/ · Servers: https://www.pulsemcp.com/servers/ (~**22k+** listed) · API: https://www.pulsemcp.com/api · Sub-registry docs: https://www.pulsemcp.com/api/docs/v0.1
- **Coverage / quality:** Large curated directory; submissions + crawl + official registry; enrichment (popularity, security, compatibility). Core contributor to official registry.
- **API feasibility:** **Partner / gated.** Implements Generic MCP Registry API at `https://api.pulsemcp.com` — probe returned **401**. Contact `hello@pulsemcp.com`.
- **License / ToS:** Commercial partner offering; not a free bulk dump.
- **Agent-dir usefulness:** Excellent enrichment layer *if* partnership works; otherwise use HTML only with caution.

### mcp.so
- **URL:** https://mcp.so/
- **Coverage / quality:** Large community marketplace (often claimed 10k–17k+); popular/featured browsing; mixed quality.
- **API feasibility:** No well-documented public registry API found; **scrape or partner**. Submit via site.
- **ToS:** Review before scraping; typical marketplace restrictions.
- **Agent-dir usefulness:** Medium — discovery/SEO overlap; weaker machine contract than official/Glama/Smithery.

### mcpservers.org (+ punkpeye list)
- **URLs:** https://mcpservers.org/ · Submit: https://mcpservers.org/submit · Source list: https://github.com/punkpeye/awesome-mcp-servers (~90k★, MIT; homepage points at Glama)
- **Coverage / quality:** Long-standing curated awesome list + web UI; README-scale curation with web search/filter. Some stale/abandoned entries.
- **API feasibility:** Parse README / site; no official open registry API comparable to MCP Registry. Glama is the machine-readable sibling for much of this community.
- **License:** MIT on the awesome repo (attribution required).
- **Agent-dir usefulness:** Good for categories + human curation signals; secondary to APIs.

### Cursor ecosystem
- **cursor.directory:** https://cursor.directory/ · Submit: https://cursor.directory/plugins/new  
  Auto-detects Open Plugins (`.mcp.json` / `mcp.json` in GitHub repos). Community plugins + MCP, not a full MCP registry.
- **Cursor Marketplace:** https://cursor.com/marketplace (official plugins)
- **Deprecated list:** https://github.com/cursor/mcp-servers (archived → use cursor.directory)
- **Docs:** https://cursor.com/docs/mcp
- **API feasibility:** Site/Supabase-backed community directory; no public “list all MCPs” API documented. Scrape or partner.
- **Usefulness:** Important for Cursor-install UX and “Add to Cursor” patterns; incomplete as a global MCP census.

### Other community hubs
- **MCP-HUB (badhope):** https://github.com/badhope/MCP-HUB — claims 4.4k+ servers, FastAPI + open `servers-index.json` dump; useful open JSON alternative.
- **QVeris:** specialized financial capability routing (niche vertical).
- Comparison writeup: https://qveris.ai/guides/mcp-registry-comparison/

---

## 3. GitHub topics & awesome lists

### Topics (discovery crawls)
| Topic | URL |
|---|---|
| `mcp-server` | https://github.com/topics/mcp-server |
| `mcp-servers` | https://github.com/topics/mcp-servers |
| `model-context-protocol` | https://github.com/topics/model-context-protocol |
| `mcp` | https://github.com/topics/mcp |

Use GitHub Search/API (`topic:mcp-server`, language filters). High recall, noisy (clients, SDKs, unrelated “mcp”).

### Awesome / curated lists
| Repo | URL | Notes |
|---|---|---|
| punkpeye/awesome-mcp-servers | https://github.com/punkpeye/awesome-mcp-servers | Largest social proof; MIT; pairs with Glama/mcpservers.org |
| TensorBlock/awesome-mcp-servers | https://github.com/TensorBlock/awesome-mcp-servers | Large categorized index; claims 7k+; **`data/catalog.json`** + optional `/v1/servers` search API in README |
| appcypher/awesome-mcp-servers | https://github.com/appcypher/awesome-mcp-servers | Classic curated awesome (~5.7k★) |
| AlexMili/Awesome-MCP | https://github.com/AlexMili/Awesome-MCP | Servers + clients + SDKs; activity signals |
| daedalus/awesome-mcp-servers | https://github.com/daedalus/awesome-mcp-servers | Large categorized dump (related to TensorBlock-style indexing) |

**Feasibility:** Git clone / parse markdown or JSON. TensorBlock `catalog.json` is the most agent-friendly among awesome lists.  
**License:** Mostly MIT — fine for attribution-based aggregation.

---

## 4. npm (and sibling package registries)

### npm
- Search API: `https://registry.npmjs.org/-/v1/search?text=keywords:mcp-server&size=…`
- Observed (Jul 27 2026):
  - `keywords:mcp-server` → **~7,212** packages
  - `keywords:model-context-protocol` → **~31k** (looser)
  - `keywords:mcp` → **~62k** (very noisy)
- Official scope: `@modelcontextprotocol/*` (servers, SDK, inspector)
- Registry linkage: packages may declare `mcpName` matching official registry identity.

**Quality:** High volume, many false positives / wrappers. Best as **enrichment** (downloads, versions) after identity from official registry `packages[].identifier`.

### PyPI / NuGet / OCI
- Official `server.json` supports `registryType`: `npm` | `pypi` | `nuget` | `oci` | `mcpb`.
- PyPI: search `mcp` / `mcp-server` via https://pypi.org/ (HTML); warehouse JSON APIs for known names.
- Docker/OCI: Hub `mcp/*`, GHCR, etc.
- **Usefulness:** Resolve install commands (`npx`, `uvx`, `docker run`) once you have package IDs from the Registry.

---

## 5. Machine-readable catalogs / APIs / schemas

| Artifact | URL | Notes |
|---|---|---|
| Official Registry REST | https://registry.modelcontextprotocol.io/v0.1/servers | Cursor pagination + incremental sync |
| Official OpenAPI | https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml | **MIT**; implement as subregistry |
| server.json schema | https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json | Canonical server metadata |
| Protocol JSON Schema | https://github.com/modelcontextprotocol/specification | Tools/resources/prompts wire format |
| Glama MCP API | https://glama.ai/api/mcp/v1/servers | Search + detail |
| Smithery Registry | https://registry.smithery.ai/servers · OpenAPI in Smithery docs | ~7.4k; pagination `totalCount` |
| PulseMCP Sub-Registry | https://api.pulsemcp.com/v0.1/servers | Same shape as official + `_meta` enrichment; **auth required** |
| TensorBlock catalog | https://github.com/TensorBlock/awesome-mcp-servers/tree/main/data | `catalog.json` |
| Docker mcp-registry | https://github.com/docker/mcp-registry | Curated YAML/metadata for Hub catalog |
| MCP-HUB dump | https://github.com/badhope/MCP-HUB | Claims open `servers-index.json` |
| npm search API | https://registry.npmjs.org/-/v1/search | Keyword discovery |
| Docker Hub API | https://hub.docker.com/v2/repositories/mcp/ | Namespace listing |

**Subregistry pattern (official recommendation):** consume official API → store → expose your own OpenAPI-compatible `/v0.1/servers` with `_meta` (ratings, security, agent install templates). That is the cleanest long-term design for sdks.directory.

---

## Practical notes for sdks.directory

1. **Ingest P0:** Official Registry sync (`updated_since` + status tracking for `deleted`).
2. **Normalize** everything to `server.json` (+ your `_meta.com.sdks.directory/...`).
3. **Enrich P1:** Glama (tools/scores) + Smithery (usage/verified/remote) where ToS allows; PulseMCP if partnered.
4. **Dedupe keys:** prefer registry `name` (`io.github.user/server`); fall back to repo URL / npm id.
5. **Package registries** for install resolution and download popularity — not primary identity.
6. **Awesome lists / GitHub topics** for long-tail candidates missing from the official registry; promote to first-class only after schema validation.
7. **Avoid** relying on mcp.so / cursor.directory as primary feeds until you have API or license clarity.
8. **Agent UX fields to store:** transports (stdio / SSE / streamable-http), env/secrets schema, package install cmd, remote URL, client snippets (Cursor / Claude / VS Code), security/status, last verified.

---

## Source scorecard (agent directory fit)

| Source | Breadth | Quality | Machine API | Legal clarity | Fit |
|---|---|---|---|---|---|
| Official MCP Registry | Med–High | High (canonical) | Excellent | High (aggregator-intended) | ★★★★★ |
| Glama | Very high | High (scored) | Good | Medium (ToS) | ★★★★★ |
| Smithery | High | High (verified subset) | Good | Medium | ★★★★☆ |
| PulseMCP | Very high | High (curated) | Partner-only | Medium–Low free use | ★★★★☆ |
| Docker MCP Catalog | Low–Med | Very high | Good (repo/Hub) | High | ★★★★☆ |
| punkpeye / TensorBlock | High | Mixed | JSON/README | High (MIT) | ★★★☆☆ |
| npm keywords | High noise | Mixed | Excellent | High | ★★★☆☆ |
| mcp.so | High | Mixed | Poor | Unclear scrape | ★★☆☆☆ |
| cursor.directory | Cursor-centric | Mixed | Poor | Unclear | ★★☆☆☆ |

**Bottom line:** Build on **registry.modelcontextprotocol.io + server.json OpenAPI**, enrich with **Glama/Smithery/(PulseMCP)**, and use **GitHub/npm/Docker** as secondary discovery and install resolution — not as the system of record.
