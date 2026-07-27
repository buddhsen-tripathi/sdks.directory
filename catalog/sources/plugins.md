# Plugins Vertical Research Notes (sdks.directory)

**Date:** 2026-07-27  
**Scope:** Public catalogs for installable agent extensions / IDE-agent plugins / skills / rules / tools  
**Usefulness scale:** ★★★★★ = primary ingest candidate · ★☆☆☆☆ = historical / low ROI

---

## 1. Landscape: what “plugin” means in 2026

The word **plugin** has converged on a **distributable package** for coding agents, not a single product surface. Typical contents:

| Component | Role |
|-----------|------|
| **Skills** (`SKILL.md`) | On-demand workflows / procedural knowledge (Agent Skills open standard) |
| **Rules / instructions** | Always-on or scoped coding guidelines |
| **Agents / subagents** | Specialized agent definitions |
| **Commands** | Slash commands |
| **Hooks** | Lifecycle hooks around agent runs |
| **MCP servers** | External tools/data (often bundled inside a “plugin”) |
| **Connectors / Apps** | Auth’d product integrations (esp. OpenAI ChatGPT/Codex) |

### Convergence pattern (important for taxonomy)

- **Cursor**, **Claude Code**, **VS Code / Copilot**, and **OpenAI Codex** all moved toward **Git-backed marketplaces** with a `marketplace.json` + per-plugin manifest (`.cursor-plugin/`, `.claude-plugin/`, `.codex-plugin/`, etc.).
- **Agent Skills (`SKILL.md`)** is the cross-runtime unit ([agentskills.io](https://agentskills.io), Anthropic origin; also loaded by Cursor, Codex, Copilot, Gemini CLI, etc.).
- **MCP** is the cross-runtime *tool* unit; often nested inside plugins.
- **Legacy ChatGPT Plugins (2023–2024)** are dead. OpenAI reused the name in **July 2026** for a new Plugin Directory (skills + apps/connectors + templates).

### Recommended sdks.directory facet model

Treat **Plugin** as the vertical, with subtypes:

1. **Agent plugins** (installable bundles)  
2. **Skills** (SKILL.md packages)  
3. **Rules** (Cursor/Windsurf-style)  
4. **MCP servers** (tools; may already be a sibling vertical)  
5. **IDE extensions** (VS Code Marketplace — only agent-relevant)  
6. **Framework tools** (LangChain / LlamaIndex / CrewAI / Composio)  
7. **Chat surfaces** (OpenAI Plugins 2026, GPT Store — secondary)

---

## 2. Source catalog (by ecosystem)

### A. Cursor — skills / marketplace / rules

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **Cursor Marketplace** | https://cursor.com/marketplace | Official curated plugins (skills, rules, agents, commands, hooks, MCP). Partner/vendor heavy (AWS, Figma, Linear, Datadog, etc.). Manual review. | Scrape marketplace HTML/API if exposed; otherwise manual + watch GitHub plugin repos linked from listings. Docs: https://cursor.com/docs/plugins · https://cursor.com/docs/reference/plugins | ★★★★★ |
| **Cursor plugin docs / template** | https://cursor.com/docs/plugins · https://github.com/cursor/plugin-template | Schema for `.cursor-plugin/plugin.json` + multi-plugin `marketplace.json` | Treat as schema source of truth for normalization | ★★★★☆ |
| **cursor.directory** | https://cursor.directory · https://github.com/pontusab/cursor.directory | Community Cursor/Windsurf **rules** (+ MCP listings). ~1k+ rules historically; open source. | GitHub scrape / site crawl; rules often `.mdc` / `.cursorrules` | ★★★★☆ |
| **Cursor Skills (local + docs)** | https://cursor.com/docs/skills · https://cursor.com/help/customization/skills | Not a store; documents skill dirs (`.cursor/skills`, also loads `.claude/skills`, `.codex/skills`) | No catalog — use skills.sh / SkillsMP / Marketplace | ★★☆☆☆ (spec only) |
| **Team Marketplaces** | Cursor dashboard / changelog https://cursor.com/changelog/05-01-26 | Private org catalogs | Not public | ★☆☆☆☆ (out of scope) |

**Notes:** Official marketplace is the highest-signal Cursor source. Community long-tail lives in GitHub + cursor.directory + SKILL.md indexes.

---

### B. Claude Code — skills / plugins

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **Claude Plugins directory** | https://claude.com/plugins | Official browsable store (Claude Code + Cowork). Install counts, Anthropic-verified badges. | Scrape public directory; submission form for new entries | ★★★★★ |
| **anthropics/claude-plugins-official** | https://github.com/anthropics/claude-plugins-official | Canonical Git marketplace for Claude Code plugins (`/plugins`, `/external_plugins`) | Parse repo + `marketplace.json`; install via `/plugin install name@claude-plugins-official` | ★★★★★ |
| **Claude Code docs — Discover plugins** | https://code.claude.com/docs/en/discover-plugins | Marketplace model, scopes, Discover tab | Schema / process reference | ★★★★☆ |
| **Plugin marketplaces docs** | https://code.claude.com/docs/en/plugin-marketplaces | Git repo + `.claude-plugin/marketplace.json` format (also referenced by VS Code Copilot) | Schema for multi-marketplace ingest | ★★★★☆ |
| **anthropics/skills** | https://github.com/anthropics/skills | Official skills / Agent Skills examples | Git crawl of `SKILL.md` | ★★★★☆ |
| **claudemarketplaces.com** | https://claudemarketplaces.com | Community-voted plugins/skills/MCP | Crawl directory (discovery, not install path) | ★★★☆☆ |
| **Community marketplaces** (examples) | e.g. `jeremylongshore/claude-code-plugins`, `alirezarezvani/claude-skills` | Variable quality Git marketplaces | `/plugin marketplace add owner/repo` then parse their manifests | ★★★☆☆ |

**Notes:** Claude’s model is **decentralized marketplaces** (add any Git catalog) + one **official** curated front door. Best ingest = official site + official GitHub repo + skills indexes below.

---

### C. Cross-agent Skills directories (highest leverage for a Plugins vertical)

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **skills.sh** (Vercel Labs) | https://skills.sh · CLI: https://github.com/vercel-labs/skills · Changelog: https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem | Install leaderboard / directory for Agent Skills packages. CLI installs into Cursor, Claude Code, Codex, Copilot, Windsurf, Gemini CLI, 30–70+ agents. | Scrape skills.sh; or use CLI (`npx skills find`); track GitHub repos with install stats | ★★★★★ |
| **SkillsMP** | https://skillsmp.com · API: https://skillsmp.com/docs/api · OpenAPI: https://skillsmp.com/openapi.json · MCP: https://skillsmp.com/mcp | Claims **millions** of GitHub-crawled `SKILL.md` files; categories, occupations, free REST API | **Best machine ingest:** REST API (rate limits: anon 50/day, authed 500/day) | ★★★★★ |
| **Agent Skills spec** | https://agentskills.io · https://github.com/anthropics/skills | Format standard | Schema only | ★★★★☆ |
| **awesome-agent-skills** (meta) | https://github.com/philipbankier/awesome-agent-skills | Curated map of skill/MCP/rules ecosystems | Seed list of sources | ★★★☆☆ |

**Notes:** For sdks.directory, **skills.sh = quality/popularity signal**, **SkillsMP = breadth + API**. Deduplicate by GitHub repo + skill path.

---

### D. VS Code / GitHub Copilot — agent plugins & extensions

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **VS Code Agent Plugins (Preview)** | https://code.visualstudio.com/docs/agent-customization/agent-plugins | Plugins = commands + skills + custom agents + hooks + MCP. Format shared with Claude Code / Copilot CLI. | Default marketplaces: `github/copilot-plugins`, `github/awesome-copilot`. Setting: `chat.plugins.marketplaces` | ★★★★★ |
| **github/awesome-copilot** | https://github.com/github/awesome-copilot · Hub: https://awesome-copilot.github.com/plugins/ · Manifest: raw `marketplace.json` on marketplace branch | Large community Copilot plugin marketplace (default in VS Code + Copilot CLI) | Parse `marketplace.json`; crawl `plugins/` | ★★★★★ |
| **github/copilot-plugins** | https://github.com/github/copilot-plugins | Official GitHub Copilot plugins marketplace | Same Git marketplace ingest | ★★★★☆ |
| **VS Code Marketplace** | https://marketplace.visualstudio.com · API: `https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery` | Full extension catalog; filter AI/Copilot/agent tags | Query API by tags (`AI`, `chat`, `copilot`, `mcp`); keep only agent-relevant | ★★★☆☆ (noisy) |
| **GitHub Copilot Chat extension** | https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat | Core product, not a catalog | N/A | ★☆☆☆☆ |
| **Copilot Extensions** (chat `@ext`) | GitHub Marketplace / VS Code | Third-party chat tools (Sentry, Datadog, etc.) — older “extensions” model vs new agent plugins | Marketplace search | ★★★☆☆ |

**Notes:** Prefer **agent plugins marketplaces** over raw VS Code extensions. Shared Claude-compatible marketplace schema is a gift for unified ingest.

---

### E. ChatGPT / OpenAI — plugins, GPTs, Codex

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **OpenAI Plugin Directory (2026)** | In-product (ChatGPT Work / Codex desktop). Help: https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex · Dev: https://developers.openai.com/codex/plugins · https://developers.openai.com/plugins/quickstart | **New** meaning of “plugin”: skills + apps/connectors + templates for ChatGPT Work & Codex. Replaced App Directory (2026-07-09). | Limited public API; scrape if public pages appear; otherwise document as in-app-only + track announced plugins | ★★★★☆ |
| **Codex plugins docs** | https://developers.openai.com/codex/plugins · Build: https://developers.openai.com/codex/plugins/build | `.codex-plugin/plugin.json`, personal/repo `marketplace.json` | Schema + local marketplace patterns | ★★★★☆ |
| **GPT Store** | https://chatgpt.com/gpts | Custom GPTs (post–2024 replacement for legacy plugins). Still live in 2026. | Hard to bulk-ingest (login walls, rankings); opportunistic / featured lists | ★★☆☆☆ |
| **Legacy ChatGPT Plugins Store (2023)** | Defunct (sunset ~Apr 2024) | Historical only | Do **not** ingest as live | ★☆☆☆☆ (archive label only) |

**Notes for product copy:** Distinguish clearly:
1. **Legacy Plugins (dead)**  
2. **GPTs / GPT Store (alive, consumer)**  
3. **Plugins 2026 = Apps + Skills packages (alive, Work/Codex)**

---

### F. Framework plugin / tool ecosystems

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **LlamaHub** | https://llamahub.ai | Data loaders, agent tools, LlamaPacks, datasets for LlamaIndex (+ usable elsewhere) | Site crawl / LlamaIndex package registries | ★★★★☆ |
| **LangChain / LangSmith Hub** | https://smith.langchain.com/hub | Primarily **prompts** (not tools). Historical plans for chains/agents. | Hub pull API / browse | ★★☆☆☆ for “plugins”; ★★★★ for prompts vertical |
| **LangChain community tools** | Docs + `langchain-community` packages | Large tool surface, not a single storefront | PyPI / docs scrape | ★★★☆☆ |
| **CrewAI Tools** | https://docs.crewai.com · `crewai-tools` package | 100+ built-in tools; AMP Tools Repository (enterprise) | Docs tables + GitHub `crewai-tools` exports | ★★★☆☆ |
| **Composio Toolkits** | https://composio.dev/toolkits · API docs | 1,000+ SaaS toolkits / 20k+ tools for agents (LangChain, CrewAI, MCP, etc.) | Public toolkit catalog + API | ★★★★☆ |
| **Pipedream / Arcade / similar connectors** | Various | Action catalogs adjacent to “plugins” | Optional secondary | ★★☆☆☆ |

**Notes:** Framework “plugins” are usually **tools/integrations**, not IDE skill bundles. Map them as subtype `framework-tool` to avoid conflating with Cursor/Claude plugins.

---

### G. MCP registries (adjacent — often bundled as plugins)

If MCP isn’t already a full vertical, these feed plugin *capabilities*:

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **Official MCP Registry** | https://registry.modelcontextprotocol.io | Canonical machine-readable registry | Registry API | ★★★★★ (canonical) |
| **mcp.so** | https://mcp.so | Very large community MCP directory (~20k+) | Site/API crawl | ★★★★☆ |
| **Smithery** | https://smithery.ai | Marketplace + CLI install / hosting | API + CLI | ★★★★☆ |
| **Glama MCP** | https://glama.ai/mcp/servers | Large index + quality scores | Crawl | ★★★★☆ |
| **PulseMCP** | https://www.pulsemcp.com/servers | Hand-reviewed directory | Crawl / feeds | ★★★☆☆ |
| **awesome-mcp-servers** | GitHub awesome lists | Curated shortlist | Markdown parse | ★★★☆☆ |

---

### H. Browser extension stores (agent-relevant only)

| Name | URL | Coverage | Ingest method | Usefulness |
|------|-----|----------|---------------|------------|
| **Chrome Web Store** | https://chromewebstore.google.com | Filter: “MCP”, “Claude Code”, “Cursor agent”, “browser control for AI” | Store search API / scrape; manual curation of agent bridges (e.g. Browser MCP) | ★★☆☆☆ |
| **Browser MCP / Agent360 examples** | https://browsermcp.dev · Chrome listings | Pattern: extension + local MCP server for real Chrome control | Treat as exemplar product class, not a catalog | ★★☆☆☆ |
| **Firefox Add-ons** | https://addons.mozilla.org | Sparse agent/MCP coverage vs Chrome | Low priority | ★☆☆☆☆ |

**Notes:** Browser stores are **not** good primary catalogs. Use them to tag a small “Agent browser bridges” subcategory.

---

## 3. Priority ingest plan for sdks.directory

### Tier 1 — start here
1. **skills.sh** + **SkillsMP API** (cross-agent Skills)  
2. **cursor.com/marketplace** + **cursor.directory**  
3. **claude.com/plugins** + **anthropics/claude-plugins-official**  
4. **github/awesome-copilot** + **github/copilot-plugins** marketplace.json  
5. **Official MCP Registry** (if MCP not already covered)

### Tier 2 — expand
6. Composio toolkits, LlamaHub  
7. OpenAI Plugin Directory (as public surface allows) + GPT Store featured only  
8. CrewAI tools docs / package  
9. Community Claude marketplaces (allowlist)

### Tier 3 — selective / noisy
10. Full VS Code Marketplace (tag-filtered)  
11. Chrome Web Store agent bridges  
12. LangSmith Hub (prompts — maybe separate vertical)

---

## 4. Ingest method cheat sheet

| Pattern | Sources | Method |
|---------|---------|--------|
| **Git marketplace.json** | Claude official, Copilot awesome, many Cursor plugins | Clone/raw JSON parse; normalize plugin entries |
| **Public storefront scrape** | cursor.com/marketplace, claude.com/plugins, skills.sh | Periodic crawl + hash for change detection |
| **REST API** | SkillsMP, MCP Official Registry, Composio, VS Marketplace Gallery | Preferred when available |
| **PyPI/npm package lists** | crewai-tools, langchain tools, LlamaIndex packs | Registry metadata + docs |
| **Manual / partner** | OpenAI Plugin Directory, Team marketplaces | Opportunistic until APIs exist |

---

## 5. Naming / taxonomy pitfalls

- **“Plugin” ≠ one format.** Prefer internal type tags: `agent-plugin`, `skill`, `rule`, `mcp`, `ide-extension`, `framework-tool`, `gpt`, `openai-plugin-2026`.
- **Skills are portable; plugins are product-packaged.** Same `SKILL.md` may appear in Cursor Marketplace, Claude plugin, and skills.sh.
- **MCP inside a plugin** should link to MCP entity, not duplicate the whole server catalog.
- **Legacy OpenAI plugins** should be labeled deprecated if mentioned at all.
- **Rules vs Skills:** Cursor docs — rules = constraints; skills = multi-step workflows.

---

## 6. Key official URLs (bookmark list)

- Cursor Marketplace: https://cursor.com/marketplace  
- Cursor Plugins docs: https://cursor.com/docs/plugins  
- cursor.directory: https://cursor.directory  
- Claude Plugins: https://claude.com/plugins  
- Claude plugins GitHub: https://github.com/anthropics/claude-plugins-official  
- Claude discover docs: https://code.claude.com/docs/en/discover-plugins  
- skills.sh: https://skills.sh  
- SkillsMP: https://skillsmp.com  
- Agent Skills spec: https://agentskills.io  
- VS Code agent plugins: https://code.visualstudio.com/docs/agent-customization/agent-plugins  
- awesome-copilot plugins: https://awesome-copilot.github.com/plugins/  
- OpenAI Codex plugins: https://developers.openai.com/codex/plugins  
- OpenAI plugins help (2026): https://help.openai.com/en/articles/20001256-plugins-in-chatgpt-and-codex  
- GPT Store: https://chatgpt.com/gpts  
- LlamaHub: https://llamahub.ai  
- LangSmith Hub: https://smith.langchain.com/hub  
- Composio toolkits: https://composio.dev/toolkits  
- MCP Official Registry: https://registry.modelcontextprotocol.io  
- mcp.so: https://mcp.so  

---

## 7. Bottom line for the Plugins vertical

The **best public signal** in 2026 is the **Agent Skills + Git marketplace plugin** stack (Cursor / Claude / Copilot / Codex / skills.sh), not classic IDE extension stores or the dead ChatGPT plugin beta. Build the vertical around **installable agent packages** and **SKILL.md**, with MCP and framework tools as linked subtypes—and treat OpenAI’s July 2026 Plugin Directory as a **revived but product-gated** peer, not as continuity with 2023 plugins.
