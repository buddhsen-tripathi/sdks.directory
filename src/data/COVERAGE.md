# SDK Catalog Coverage Report

Generated: 2026-07-27 from `src/data/sdks.ts` + `src/types/catalog.ts` (live Bun import).

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
| Featured × no skills | 3 |
| Featured × no packages | 6 |

**Skills coverage:** 47.5% (28/59)  
**Package coverage:** 40.7% (24/59)  
**Featured share:** 35.6% (21/59)

Currently skilled (28): `stripe` (1), `openai` (1), `aws` (1), `azure` (1), `cloudflare` (3), `twilio` (1), `supabase` (1), `firebase` (1), `vercel` (1), `ai-sdk` (1), `sentry` (1), `datadog` (1), `auth0` (1), `clerk` (1), `better-auth` (1), `resend` (1), `posthog` (1), `neon` (1), `prisma` (1), `mongodb` (1), `redis` (1), `pinecone` (1), `langchain` (1), `huggingface` (1), `google-genai` (1), `launchdarkly` (1), `workos` (1), `notion` (1).

Featured still missing skills: `anthropic`, `google-cloud`, `github`.

Featured still missing packages: `google-cloud`, `azure`, `firebase`, `sentry`, `auth0`, `mongodb`.

### Type shape (reference)

`SdkEntry` optional enrichment fields from `catalog.ts`:

- `packages?: PackageRef[]` — registry + name + url (npm, pypi, go, maven, …)
- `skills?: SkillRef[]` — name + url + optional install hint
- `languages: LanguageId[]` — declared language support (source of truth for language counts below)

## 2. Per-SDK coverage

Common languages checked: `python` / `nodejs` / `typescript` / `go` / `java`.

**Missing (common)** = absent from `languages[]` among that set.  
**Likely missing** = subset where the vendor almost certainly ships an official client (ecosystem-locked SDKs excluded; see notes).

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
| mapbox | 5 | 0 | 0 | — | python, nodejs, go |
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

- **Ecosystem-locked (not flagged):** `ai-sdk`, `better-auth`, `prisma`, `drizzle`, `crewai`, `openai-agents`, `linear`, `vercel`, `airtable`, `stripe-terminal`, `terraform` — intentionally narrow language surface.
- **Soft TS gaps:** entries with `nodejs`+`javascript` but not `typescript` (Twilio, Datadog, SendGrid, Plaid, Square) — Node SDK is usually the TS story; still worth aligning `languages[]`.
- **Supabase:** Go client exists (community-backed); Java weaker — only `go` flagged.
- **Neon / Clerk / Notion / Turso / Hugging Face / Mapbox:** left unflagged where first-class official SDKs for those gaps are unclear.

## 3. Top 20 — skill linking priority

Famous / high-signal SDKs with **zero** `skills[]` yet. Ranked by fame score (featured + category weight + language breadth + household-name boost).

| # | slug | featured | pkgs | langs | categories | why |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | google-cloud | yes | 0 | 10 | cloud, infrastructure | Featured; highest agent discovery value |
| 2 | anthropic | yes | 2 | 9 | ai | Featured; highest agent discovery value |
| 3 | github | yes | 1 | 8 | devtools | Featured; highest agent discovery value |
| 4 | algolia | no | 0 | 12 | devtools, database | Broad multi-lang / household adoption |
| 5 | meilisearch | no | 0 | 12 | devtools, database | Broad multi-lang / household adoption |
| 6 | shopify | no | 0 | 8 | payments, devtools | High agent/dev foot-traffic category |
| 7 | cloudinary | no | 0 | 12 | media, storage | Broad multi-lang / household adoption |
| 8 | square | no | 0 | 8 | payments | High agent/dev foot-traffic category |
| 9 | kubernetes | no | 0 | 8 | infrastructure, devtools | Broad multi-lang / household adoption |
| 10 | pulumi | no | 0 | 7 | infrastructure, devtools | Broad multi-lang / household adoption |
| 11 | plaid | no | 0 | 6 | payments | High agent/dev foot-traffic category |
| 12 | upstash | no | 1 | 4 | database, infrastructure | Broad multi-lang / household adoption |
| 13 | docker | no | 0 | 6 | infrastructure, devtools | Broad multi-lang / household adoption |
| 14 | slack | no | 0 | 6 | comms, devtools | Broad multi-lang / household adoption |
| 15 | discord | no | 0 | 9 | comms | Broad multi-lang / household adoption |
| 16 | llamaindex | no | 0 | 4 | ai | High agent/dev foot-traffic category |
| 17 | openai-agents | no | 0 | 4 | ai | High agent/dev foot-traffic category |
| 18 | turso | no | 0 | 8 | database | Broad multi-lang / household adoption |
| 19 | crewai | no | 1 | 1 | ai | High agent/dev foot-traffic category |
| 20 | linear | no | 1 | 3 | devtools | Broad multi-lang / household adoption |

**Skill sources to check:** vendor `SKILL.md` / `skills/` repos, [skills.sh](https://skills.sh), and install strings patterned after `stripe` / `cloudflare` (`npx skills add …`).

## 4. Top 20 — package enrichment priority

SDKs with **0 packages** first, then fame. Goal: at least npm + pypi when both languages are declared, then go/maven where listed.

| # | slug | pkgs now | langs | featured | skills? | enrichment target |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | firebase | 0 | 10 | yes | yes | Skilled already — add packages to match languages[] |
| 2 | azure | 0 | 10 | yes | yes | Skilled already — add packages to match languages[] |
| 3 | google-cloud | 0 | 10 | yes | no | Add primary packages (npm/pypi/go/maven) |
| 4 | auth0 | 0 | 11 | yes | yes | Skilled already — add packages to match languages[] |
| 5 | mongodb | 0 | 13 | yes | yes | Skilled already — add packages to match languages[] |
| 6 | sentry | 0 | 14 | yes | yes | Skilled already — add packages to match languages[] |
| 7 | algolia | 0 | 12 | no | no | Add primary packages (npm/pypi/go/maven) |
| 8 | meilisearch | 0 | 12 | no | no | Add primary packages (npm/pypi/go/maven) |
| 9 | shopify | 0 | 8 | no | no | Add primary packages (npm/pypi/go/maven) |
| 10 | posthog | 0 | 12 | no | yes | Skilled already — add packages to match languages[] |
| 11 | cloudinary | 0 | 12 | no | no | Add primary packages (npm/pypi/go/maven) |
| 12 | datadog | 0 | 9 | no | yes | Skilled already — add packages to match languages[] |
| 13 | square | 0 | 8 | no | no | Add primary packages (npm/pypi/go/maven) |
| 14 | kubernetes | 0 | 8 | no | no | Add primary packages (npm/pypi/go/maven) |
| 15 | workos | 0 | 9 | no | yes | Skilled already — add packages to match languages[] |
| 16 | launchdarkly | 0 | 13 | no | yes | Skilled already — add packages to match languages[] |
| 17 | pulumi | 0 | 7 | no | no | Add primary packages (npm/pypi/go/maven) |
| 18 | plaid | 0 | 6 | no | no | Add primary packages (npm/pypi/go/maven) |
| 19 | docker | 0 | 6 | no | no | Add primary packages (npm/pypi/go/maven) |
| 20 | slack | 0 | 6 | no | no | Add primary packages (npm/pypi/go/maven) |

Thin (exactly 1 package), fame-ordered — follow-up after zeros: `ai-sdk`, `huggingface`, `prisma`, `resend`, `github`, `neon`, `clerk`, `upstash`, `vercel`, `crewai`, `better-auth`, `notion`, `linear`, `drizzle`.

## 5. Recommended batch order for next PR edits to `sdks.ts`

Keep PRs small and reviewable. Prefer **skills + packages in one pass** when a slug is missing both.

### Batch A — Featured gaps (must-fix)

1. `anthropic` — **skills only** (packages already npm+pypi; optionally add go/java)
2. `google-cloud` — **skills + packages** (featured, 0 packages, 10 languages)
3. `github` — **skills**; expand beyond 1 package

### Batch B — Skilled but 0 packages (quick wins; research packages only)

Featured/high-fame entries that already have skills — package pass only:

4. `firebase`, `azure`, `auth0`, `sentry`, `mongodb`
5. `datadog`, `posthog`, `pinecone`, `launchdarkly`, `workos`

### Batch C — No skills yet: AI / payments / comms (famous)

6. `openai-agents`, `llamaindex`, `crewai` (skills; packages as applicable)
7. `shopify`, `square`, `plaid` (skills + packages; align `typescript` where missing)
8. `slack`, `discord` (skills + packages; `slack` +go in languages)

### Batch D — No skills yet: search / media / infra

9. `meilisearch`, `algolia`, `upstash`, `turso`
10. `cloudinary`, `mux`, `mapbox`, `google-maps`
11. `docker`, `kubernetes`, `pulumi` (skills if they exist; packages for client libs)
12. `segment`, `planetscale`, `sendgrid`, `gitlab`, `airtable`, `stripe-terminal`

### Batch E — Catalog hygiene

13. Soft TS language alignment: `twilio`, `datadog`, `sendgrid`, `plaid`, `square`
14. Likely language adds: `cloudflare` (+java), `supabase` (+go), `shopify` (+go), `slack` (+go), `upstash` (+go)
15. Expand 1-package entries: `neon`, `clerk`, `prisma`, `ai-sdk`, `vercel`, `notion`, `linear`, `huggingface`, `resend`, `github`, `drizzle`, `crewai`, `better-auth`

### Batch F — Already rich (skip unless touching)

`stripe`, `openai`, `aws`, `cloudflare`, `supabase`, `ai-sdk`, `better-auth`, `neon`, `prisma`, `google-genai`, `langchain`, `redis` — deepen packages to full language matrix only when convenient.

---

*Accuracy note: counts imported live via Bun from `sdks.ts` (59 entries). “Likely missing” is editorial judgment against known official SDK matrices, not a registry scrape.*
