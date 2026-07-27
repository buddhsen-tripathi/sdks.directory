# SDK Catalog Coverage Report

Generated: 2026-07-27 from `src/data/sdks.ts` + `src/types/catalog.ts`.

Product vision: **sdks.directory** is the agent-skills directory for every SDK in every language — each `SdkEntry` should eventually have `packages` per language and `skills[]` links.

## 1. Summary

| Metric | Count |
| --- | ---: |
| Total SDKs | 59 |
| With `skills[]` (≥1) | 28 |
| Without skills | 31 |
| With `packages[]` (≥1) | 24 |
| Without packages | 35 |
| Exactly 1 package | 14 |
| ≥2 packages | 10 |
| Featured | 21 |

**Skills coverage:** 47.5% (28/59)  
**Package coverage:** 40.7% (24/59)  
**Featured share:** 35.6% (21/59)

Currently skilled entries: `stripe` (1), `openai` (1), `aws` (1), `azure` (1), `cloudflare` (3), `twilio` (1), `supabase` (1), `firebase` (1), `vercel` (1), `ai-sdk` (1), `sentry` (1), `datadog` (1), `auth0` (1), `clerk` (1), `better-auth` (1), `resend` (1), `posthog` (1), `neon` (1), `prisma` (1), `mongodb` (1), `redis` (1), `pinecone` (1), `langchain` (1), `huggingface` (1), `google-genai` (1), `launchdarkly` (1), `workos` (1), `notion` (1).

### Type shape (reference)

`SdkEntry` optional enrichment fields from `catalog.ts`:

- `packages?: PackageRef[]` — registry + name + url (npm, pypi, go, maven, …)
- `skills?: SkillRef[]` — name + url + optional install hint
- `languages: LanguageId[]` — declared language support (source of truth for language counts below)

## 2. Per-SDK coverage

Common languages checked: `python` / `nodejs` / `typescript` / `go` / `java`.

**Missing (common)** = absent from `languages[]` among that set.  
**Likely missing** = subset where the vendor almost certainly ships an official client (ecosystem-locked SDKs like Prisma / AI SDK / CrewAI are excluded; see notes under the table).

| slug | langs | pkgs | skills | likely missing (common) | missing (common, raw) |
| --- | --- | --- | --- | --- | --- |
| stripe | 11 | 2 | 1 | — | — |
| openai | 8 | 2 | 1 | — | — |
| anthropic | 9 | 2 | 0 | — | — |
| aws | 12 | 2 | 1 | — | — |
| google-cloud | 10 | 0 | 0 | — | — |
| azure | 10 | 0 | 1 | — | — |
| cloudflare | 5 | 2 | 3 | java | java |
| twilio | 8 | 2 | 1 | typescript | typescript |
| supabase | 8 | 2 | 1 | go | go, java |
| firebase | 10 | 0 | 1 | — | — |
| vercel | 3 | 1 | 1 | — | python, go, java |
| ai-sdk | 3 | 1 | 1 | — | python, go, java |
| sentry | 14 | 0 | 1 | — | — |
| datadog | 9 | 0 | 1 | typescript | typescript |
| auth0 | 11 | 0 | 1 | — | — |
| clerk | 8 | 1 | 1 | — | java |
| better-auth | 3 | 1 | 1 | — | python, go, java |
| resend | 8 | 1 | 1 | — | — |
| sendgrid | 8 | 0 | 0 | typescript | typescript |
| posthog | 12 | 0 | 1 | — | — |
| segment | 11 | 0 | 0 | — | — |
| planetscale | 8 | 0 | 0 | — | — |
| neon | 5 | 1 | 1 | — | java |
| prisma | 3 | 1 | 1 | — | python, go, java |
| drizzle | 3 | 1 | 0 | — | python, go, java |
| mongodb | 13 | 0 | 1 | — | — |
| redis | 10 | 2 | 1 | — | — |
| pinecone | 6 | 0 | 1 | — | — |
| algolia | 12 | 0 | 0 | — | — |
| mapbox | 5 | 0 | 0 | python, nodejs, go | python, nodejs, go |
| google-maps | 9 | 0 | 0 | — | — |
| cloudinary | 12 | 0 | 0 | — | — |
| mux | 9 | 0 | 0 | — | — |
| github | 8 | 1 | 0 | — | — |
| gitlab | 6 | 0 | 0 | java | java |
| docker | 6 | 0 | 0 | typescript | typescript |
| kubernetes | 8 | 0 | 0 | — | — |
| terraform | 1 | 0 | 0 | — | python, nodejs, typescript, java |
| pulumi | 7 | 0 | 0 | — | — |
| langchain | 4 | 2 | 1 | go, java | go, java |
| llamaindex | 4 | 0 | 0 | — | go, java |
| huggingface | 4 | 1 | 1 | — | go, java |
| google-genai | 7 | 2 | 1 | — | — |
| plaid | 6 | 0 | 0 | typescript | typescript |
| square | 8 | 0 | 0 | typescript | typescript |
| shopify | 8 | 0 | 0 | go | go |
| slack | 6 | 0 | 0 | go | go |
| discord | 9 | 0 | 0 | — | — |
| stripe-terminal | 5 | 0 | 0 | — | python, nodejs, go |
| launchdarkly | 13 | 0 | 1 | — | — |
| workos | 9 | 0 | 1 | — | — |
| linear | 3 | 1 | 0 | — | python, go, java |
| notion | 4 | 1 | 1 | — | go, java |
| airtable | 3 | 0 | 0 | — | python, go, java |
| openai-agents | 4 | 0 | 0 | — | go, java |
| crewai | 1 | 1 | 0 | — | nodejs, typescript, go, java |
| meilisearch | 12 | 0 | 0 | — | — |
| upstash | 4 | 1 | 0 | go | go, java |
| turso | 8 | 0 | 0 | — | java |

### Notes on “likely missing”

- **Ecosystem-locked (not flagged):** `ai-sdk`, `better-auth`, `prisma`, `drizzle`, `crewai`, `openai-agents`, `linear`, `vercel`, `airtable`, `stripe-terminal` — product is intentionally JS/TS-, Python-, or mobile-POS-scoped.
- **Soft TS gaps:** entries that list `nodejs` + `javascript` but not `typescript` (e.g. Twilio, Datadog, SendGrid, Plaid, Square) usually have a Node SDK that is the TypeScript story — still worth aligning `languages[]` for catalog consistency.
- **Supabase:** official Go client exists (community-backed); Java is weaker — only `go` flagged.
- **Neon / Clerk / Notion / Turso / Hugging Face:** gaps left unflagged where first-class official SDKs are unclear or absent for those languages.

## 3. Top 20 — skill linking priority

Famous / high-signal SDKs with **zero** `skills[]` yet. Ranked by a simple fame score (featured + category weight + language breadth + household-name boost).

| # | slug | featured | pkgs | langs | categories | why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | google-cloud | yes | 0 | 10 | cloud, infrastructure | Featured household name; agents hit these first |
| 2 | anthropic | yes | 2 | 9 | ai | Featured household name; agents hit these first |
| 3 | github | yes | 1 | 8 | devtools | Featured household name; agents hit these first |
| 4 | meilisearch | no | 0 | 12 | devtools, database | High adoption / multi-lang surface; skill docs unlock agent use |
| 5 | shopify | no | 0 | 8 | payments, devtools | High adoption / multi-lang surface; skill docs unlock agent use |
| 6 | square | no | 0 | 8 | payments | High adoption / multi-lang surface; skill docs unlock agent use |
| 7 | plaid | no | 0 | 6 | payments | High adoption / multi-lang surface; skill docs unlock agent use |
| 8 | upstash | no | 1 | 4 | database, infrastructure | High adoption / multi-lang surface; skill docs unlock agent use |
| 9 | slack | no | 0 | 6 | comms, devtools | High adoption / multi-lang surface; skill docs unlock agent use |
| 10 | discord | no | 0 | 9 | comms | High adoption / multi-lang surface; skill docs unlock agent use |
| 11 | openai-agents | no | 0 | 4 | ai | High adoption / multi-lang surface; skill docs unlock agent use |
| 12 | turso | no | 0 | 8 | database | High adoption / multi-lang surface; skill docs unlock agent use |
| 13 | crewai | no | 1 | 1 | ai | High adoption / multi-lang surface; skill docs unlock agent use |
| 14 | algolia | no | 0 | 12 | devtools, database | High adoption / multi-lang surface; skill docs unlock agent use |
| 15 | cloudinary | no | 0 | 12 | media, storage | High adoption / multi-lang surface; skill docs unlock agent use |
| 16 | linear | no | 1 | 3 | devtools | High adoption / multi-lang surface; skill docs unlock agent use |
| 17 | kubernetes | no | 0 | 8 | infrastructure, devtools | High adoption / multi-lang surface; skill docs unlock agent use |
| 18 | pulumi | no | 0 | 7 | infrastructure, devtools | High adoption / multi-lang surface; skill docs unlock agent use |
| 19 | segment | no | 0 | 11 | analytics | High adoption / multi-lang surface; skill docs unlock agent use |
| 20 | docker | no | 0 | 6 | infrastructure, devtools | High adoption / multi-lang surface; skill docs unlock agent use |

**Suggested skill sources to check first:** vendor `SKILL.md` / `skills/` repos, [skills.sh](https://skills.sh), Anthropic/OpenAI cookbook skill packs, and Cloudflare-style `npx skills add …` install strings already used on `stripe` / `cloudflare`.

## 4. Top 20 — package enrichment priority

SDKs with **0 packages** (preferred) or only **1**, ordered by need then fame. Goal: at least npm + pypi (when both languages are declared), then go/maven where listed.

| # | slug | pkgs now | langs | featured | enrichment target |
| --- | --- | --- | --- | --- | --- |
| 1 | firebase | 0 | 10 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 2 | azure | 0 | 10 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 3 | google-cloud | 0 | 10 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 4 | auth0 | 0 | 11 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 5 | mongodb | 0 | 13 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 6 | sentry | 0 | 14 | yes | Add primary packages for top languages (npm/pypi/go/maven) |
| 7 | meilisearch | 0 | 12 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 8 | shopify | 0 | 8 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 9 | posthog | 0 | 12 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 10 | datadog | 0 | 9 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 11 | square | 0 | 8 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 12 | workos | 0 | 9 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 13 | launchdarkly | 0 | 13 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 14 | plaid | 0 | 6 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 15 | slack | 0 | 6 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 16 | discord | 0 | 9 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 17 | openai-agents | 0 | 4 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 18 | turso | 0 | 8 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 19 | pinecone | 0 | 6 | no | Add primary packages for top languages (npm/pypi/go/maven) |
| 20 | algolia | 0 | 12 | no | Add primary packages for top languages (npm/pypi/go/maven) |

Also thin (1 package) and worth a follow-up PR after the zero-package batch: `vercel`, `ai-sdk`, `clerk`, `better-auth`, `resend`, `neon`, `prisma`, `drizzle`, `github`, `huggingface`, `linear`, `notion`, `crewai`, `upstash` (several already skilled — package depth still weak).

## 5. Recommended batch order for next PR edits to `sdks.ts`

Edit in small, reviewable PRs. Prefer **skills + packages together** on the same slug when both are empty — one research pass per vendor.

### Batch A — Featured AI/cloud with no skills (highest agent value)

1. `openai` — add skills; packages already have npm+pypi (add go/java if easy)
2. `anthropic` — add skills; same package depth as openai
3. `aws` — skills (boto3 / AWS API patterns); packages already partial
4. `google-cloud` — skills + first packages (npm/pypi/go)
5. `azure` — skills + first packages
6. `langchain` — skills; packages already npm+pypi
7. `huggingface` — skills; expand packages beyond single entry

### Batch B — Featured infra / auth / data (no skills, often 0 packages)

8. `firebase` — skills + packages
9. `auth0` — skills + packages
10. `sentry` — skills + packages
11. `mongodb` — skills + packages
12. `twilio` — skills; align `typescript` in languages[]; packages ok
13. `resend` — skills; expand packages
14. `github` — skills; expand packages

### Batch C — Package-first for multi-lang zeros (skills if an official skill exists)

15. `datadog`, `posthog`, `meilisearch`, `launchdarkly`, `algolia`
16. `shopify`, `square`, `plaid`, `slack`, `discord`, `workos`
17. `pinecone`, `turso`, `openai-agents`, `segment`, `planetscale`, `sendgrid`

### Batch D — Catalog hygiene (languages + thin packages)

18. Align soft TS gaps: `twilio`, `datadog`, `sendgrid`, `plaid`, `square`
19. Likely language adds: `cloudflare` (+java if keeping), `supabase` (+go), `shopify` (+go), `slack` (+go), `upstash` (+go)
20. Expand 1-package featured/popular entries: `neon`, `clerk`, `prisma`, `ai-sdk`, `vercel`, `notion`, `linear`, `huggingface`

### Batch E — Already skilled (polish only)

Leave for last unless a PR is already touching them: `stripe`, `cloudflare`, `supabase`, `ai-sdk`, `better-auth`, `neon`, `prisma`, `google-genai` — deepen `packages[]` to match `languages[]`.

---

*Accuracy note: counts imported live via Bun from `sdks.ts` (59 entries). “Likely missing” is editorial judgment against known official SDK matrices, not a registry scrape.*
