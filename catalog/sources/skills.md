# Agent Skills ↔ SDK inventory

High-signal skills that teach agents how to use a specific SDK/platform. Your repo already mirrors many of these under `catalog/skills/` (not `data/skills/`).

**Copy legend:** Yes = permissive license + clear upstream · Prefer link = missing/unclear license or better as live install · Skip = not an SDK skill / wrong fit

---

## Discovery sources

| Source | URL | Notes |
|--------|-----|--------|
| skills.sh registry | https://skills.sh | Install via `npx skills add owner/repo` |
| Skills CLI | https://github.com/vercel-labs/skills | Discovers `skills/`, `data/skills/`, `.agents/skills/`, etc. |
| Agent Skills spec | https://agentskills.io | Open `SKILL.md` format |
| Awesome list | https://github.com/heilcheng/awesome-agent-skills | Curated vendor index |
| Stripe skills index | https://docs.stripe.com/.well-known/skills/index.json | Machine-readable catalog |

### Local skill roots found

`~/.claude/skills/`, `~/.cursor/skills/`, `~/.codex/skills/`, `~/.agents/skills/`, `~/.gemini/skills/`, `~/.continue/skills/`, `~/.config/opencode|goose|agents|crush|devin/skills/`

---

## Priority catalog mappings (SDK entries)

### Cloudflare — https://github.com/cloudflare/skills · **Apache-2.0** · **Yes, copy**

| Skill | Path / URL | Description | In catalog? |
|-------|------------|-------------|-------------|
| `cloudflare` | `skills/cloudflare` | Platform umbrella (Workers, KV, D1, R2, AI, IaC) | Yes |
| `agents-sdk` | `skills/agents-sdk` | Cloudflare Agents SDK | Yes |
| `durable-objects` | `skills/durable-objects` | DO patterns | Yes |
| `sandbox-sdk` | `skills/sandbox-sdk` | Sandbox SDK | Yes |
| `wrangler` | `skills/wrangler` | Wrangler CLI | Yes |
| `workers-best-practices` | `skills/workers-best-practices` | Workers production practices | Yes |
| `turnstile-spin` | `skills/turnstile-spin` | Turnstile end-to-end | Yes |
| `cloudflare-email-service` | `skills/cloudflare-email-service` | Email Sending/Routing | Yes |
| `cloudflare-one` (+ migrations) | repo skills dirs | Cloudflare One / SASE | No — optional |
| `web-perf` | `skills/web-perf` | CWV auditing (Chrome MCP) | Borderline |

Install: `npx skills add https://github.com/cloudflare/skills`

---

### Neon — https://github.com/neondatabase/agent-skills · **Apache-2.0** · **Yes, copy**

| Skill | Description | In catalog? |
|-------|-------------|-------------|
| `neon-postgres` | Serverless Postgres + drivers/CLI/MCP/Auth | Yes (from `~/.claude`) |
| `neon`, `neon-postgres-branches`, `neon-postgres-egress-optimizer`, `claimable-postgres`, `neon-ai-gateway`, `neon-functions`, `neon-object-storage` | Focused Neon workflows | No — good next adds |

Install: `npx skills add neondatabase/agent-skills`

---

### Better Auth — https://github.com/better-auth/skills · **License unclear (no LICENSE on repo)** · **Prefer link / ask vendor**

| Skill | Path | Description | In catalog? |
|-------|------|-------------|-------------|
| `best-practices` | `better-auth/best-practices` | Core integration practices | Partial (`better-auth-best-practices` from local cache) |
| `create-auth` | `better-auth/create-auth` | Scaffold auth setup | No |
| `emailAndPassword` | `better-auth/emailAndPassword` | Email/password flows | No |
| `organization` | `better-auth/organization` | Orgs plugin | No |
| `twoFactor` | `better-auth/twoFactor` | 2FA | No |
| `security` | `security/SKILL.md` | Security hardening | No |

Do not wholesale-vend without clarifying license; keep `SOURCE.md` + upstream URL, or submodule.

---

### Vercel AI SDK — https://github.com/vercel/ai (`skills/use-ai-sdk`) · package **NOASSERTION** · **Prefer link / submodule**

| Skill | URL | Description | In catalog? |
|-------|-----|-------------|-------------|
| `ai-sdk` / `use-ai-sdk` | `vercel/ai` → `skills/use-ai-sdk` | Official consumer skill: don’t trust memory; use bundled `node_modules/ai` docs | Yes (local copy) |
| Contributor skills (`add-provider-package`, `migrate-ai-sdk-v6-to-v7`, …) | same repo | Internal SDK maintenance | **Skip** for public catalog |

Install: `npx skills add vercel/ai` (docs recommend this)

---

### Stripe — https://github.com/stripe/ai/tree/main/skills · **MIT** · **Yes, copy** (+ https://docs.stripe.com/.well-known/skills/)

| Skill | Description | Catalog slug |
|-------|-------------|--------------|
| `stripe-best-practices` | Checkout/PaymentIntents, Connect, Billing, Tax, security | `stripe` |
| `upgrade-stripe` | API/SDK upgrades | `stripe` |
| `connect-recommend` | Connect architecture advice | `stripe` |
| `stripe-docs` | Docs lookup workflow | `stripe` |
| `stripe-projects` | Provision third-party services via Stripe Projects | optional |
| `stripe-directory` | Find partners/services | optional |

Install: `npx skills add https://docs.stripe.com`

---

### Vercel engineering (not AI SDK) — https://github.com/vercel-labs/agent-skills · **No LICENSE file found** · **Prefer link**

`react-best-practices`, `composition-patterns`, `react-native-skills`, `web-design-guidelines`, `vercel-optimize`, `deploy-to-vercel`, `vercel-cli-with-tokens`, …

Map to `nextjs` / `vercel` / `react` if those catalog entries exist; not a substitute for `ai-sdk`.

---

### Google Gemini — local + community · **Verify upstream** · **Prefer official source**

| Skill | Path | Description | In catalog? |
|-------|------|-------------|-------------|
| `gemini-api-dev` | `~/.claude/skills/gemini-api-dev` → catalog `gemini/` | `google-genai` / `@google/genai` SDK usage | Yes |
| Related | awesome list: `vertex-ai-api-dev`, `gemini-live-api-dev`, … | Vertex / Live APIs | Optional |

---

### Drizzle ORM — local community skill · **License unclear** · **Prefer link until official**

| Skill | Path | Notes |
|-------|------|--------|
| `drizzle-orm` | `~/.claude/...` + `catalog/skills/drizzle/` | No official `drizzle-team/skills` found; community copies exist |

---

### OpenAI / Anthropic

| Skill | Source | SDK fit | Copy? |
|-------|--------|---------|-------|
| `openai-docs` | `~/.codex/skills/.system/openai-docs` | OpenAI APIs/docs via Docs MCP | **Prefer link** (system skill; redistribution unclear) |
| `imagegen`, `speech`, `sora` | openai curated skills / plugins | Product APIs | Optional for `openai` |
| anthropics/skills (`docx`, `pdf`, `mcp-builder`, …) | https://github.com/anthropics/skills | **Not** Anthropic API SDK skills | **Skip** for SDK catalog |
| Claude Agent SDK docs | https://code.claude.com/docs/en/agent-sdk/skills | How to *load* skills in the Agent SDK | Meta — not a product SDK skill |

There is no clean official “Anthropic Messages API SDK” skill analogous to Stripe/Neon/Cloudflare.

---

### Other strong SDK/platform skills (web)

| Vendor | Repo / skill | License | Copy? | Catalog slug |
|--------|--------------|---------|-------|--------------|
| Expo | https://github.com/expo/skills | MIT | Yes | `expo` |
| Remotion | https://github.com/remotion-dev/skills | check repo | Likely yes if MIT/Apache | `remotion` |
| Resend | https://github.com/resend/resend-skills | check repo | Likely yes | `resend` |
| Supabase | `postgres-best-practices` (awesome list) | check | Prefer link | `supabase` |
| Chat SDK | local `chat-sdk` | unclear | Prefer link | needs entry |
| shadcn/ui, Framer Motion, FastAPI, Docker | local | N/A | Optional / framework not core SDK |

---

## Already in this repo (`catalog/skills/`)

| Vendor folder | Skills present |
|---------------|----------------|
| `cloudflare/` | cloudflare, wrangler, workers-best-practices, durable-objects, agents-sdk, sandbox-sdk, turnstile-spin, cloudflare-email-service |
| `neon/` | neon-postgres |
| `drizzle/` | drizzle-orm |
| `better-auth/` | better-auth-best-practices |
| `ai-sdk/` | ai-sdk |
| `gemini/` | gemini-api-dev |
| `chat-sdk/` | chat-sdk (no sdk slug yet) |

Each has `SOURCE.md` noting collection from `~/.claude/skills` on 2026-07-27 — upstream URLs should be filled in (Cloudflare/Neon are clear; Better Auth/Drizzle/AI SDK need verification).

---

## Recommended next copies (cleanest wins)

1. **Stripe** full set from `docs.stripe.com` / `stripe/ai` (MIT)  
2. Remaining **Neon** skills (Apache-2.0)  
3. **Expo** skills (MIT)  
4. Re-sync **Cloudflare** from GitHub (already Apache-2.0; keep `SOURCE.md` + LICENSE)  
5. Replace vague AI SDK provenance with pin to `vercel/ai/skills/use-ai-sdk` (link or submodule if license stays NOASSERTION)  
6. Expand Better Auth only after license clarity  

---

## Folder schema (align with existing catalog)

Prefer extending what you already have over inventing `data/skills/`:

```text
catalog/
  skills/
    index.json                 # id, path, sdkSlugs[], tags, optional upstream
    README.md
    {vendor-or-sdk-slug}/      # e.g. cloudflare, stripe, neon, ai-sdk
      {skill-id}/              # matches SKILL.md `name` when possible
        SKILL.md
        SOURCE.md              # upstream URL, commit/sha, license, collected-at
        LICENSE                # copy of upstream license when vendoring
        references/            # optional progressive disclosure
        scripts/               # optional
        assets/
```

**`index.json` fields worth adding:**

```json
{
  "id": "stripe-best-practices",
  "path": "stripe/stripe-best-practices",
  "sdkSlugs": ["stripe"],
  "upstream": "https://github.com/stripe/ai/tree/main/skills/stripe-best-practices",
  "install": "npx skills add https://docs.stripe.com --skill stripe-best-practices",
  "license": "MIT",
  "vendorPolicy": "vendored",
  "tags": ["payments"]
}
```

**Policy:**

| Policy | When |
|--------|------|
| `vendored` | Apache-2.0 / MIT with LICENSE + attribution in tree |
| `linked` | Unclear license, fast-moving docs, or prefer `npx skills add` |
| `submodule` / sparse checkout | Large trees (Cloudflare references) |

Keep agent-installable layout flat enough for `npx skills` discovery (`catalog/skills/` is already on the CLI search path per vercel-labs/skills).

---

## Copyright summary

| Upstream | SPDX / status | Catalog action |
|----------|---------------|----------------|
| cloudflare/skills | Apache-2.0 | Copy OK + NOTICE/LICENSE |
| neondatabase/agent-skills | Apache-2.0 | Copy OK |
| stripe/ai skills | MIT | Copy OK |
| expo/skills | MIT | Copy OK |
| vercel/ai | NOASSERTION | Prefer link/submodule; don’t assume redistributable |
| vercel-labs/agent-skills | No LICENSE found | Prefer link |
| better-auth/skills | No LICENSE found | Prefer link / ask |
| Local drizzle / chat-sdk / gemini caches | Unknown | Treat as provisional until upstream confirmed |
| anthropics/skills | Document/creative skills | Out of scope for SDK catalog |
| openai system skills | Bundled with Codex | Don’t vendor blindly |

Not legal advice — when in doubt, **link + install command** beats copying.
