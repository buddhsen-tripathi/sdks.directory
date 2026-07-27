# SDK Catalog Coverage Report

Generated: 2026-07-27 from `src/data/sdks.ts` + `src/types/catalog.ts` (live Bun import).

Product vision: **sdks.directory** is the agent-skills directory for every SDK in every language — each `SdkEntry` should eventually have `packages` per language and `skills[]` links.

## 1. Summary

| Metric | Count |
| --- | ---: |
| Total SDKs | 59 |
| With `skills[]` (≥1) | 52 |
| Without skills | 7 |
| With `packages[]` (≥1) | 59 |
| Without packages | 0 |
| Exactly 1 package | 17 |
| ≥2 packages | 42 |
| Featured | 21 |
| Featured × no skills | 0 |
| Featured × no packages | 0 |

**Skills coverage:** 88.1% (52/59)  
**Package coverage:** 100.0% (59/59)  
**Featured share:** 35.6% (21/59)

Currently skilled (52): `stripe` (1), `openai` (1), `anthropic` (1), `aws` (1), `google-cloud` (1), `azure` (1), `cloudflare` (3), `twilio` (1), `supabase` (1), `firebase` (1), `vercel` (1), `ai-sdk` (1), `sentry` (1), `datadog` (1), `auth0` (1), `clerk` (1), `better-auth` (1), `resend` (1), `sendgrid` (3), `posthog` (1), `planetscale` (3), `neon` (1), `prisma` (1), `drizzle` (2), `mongodb` (1), `redis` (1), `pinecone` (1), `algolia` (3), `mapbox` (3), `google-maps` (1), `cloudinary` (3), `mux` (1), `github` (1), `gitlab` (2), `terraform` (3), `pulumi` (3), `langchain` (1), `llamaindex` (2), `huggingface` (1), `google-genai` (1), `shopify` (3), `slack` (3), `stripe-terminal` (1), `launchdarkly` (1), `workos` (1), `linear` (2), `notion` (1), `airtable` (3), `openai-agents` (2), `crewai` (3), `upstash` (4), `turso` (2).

Still missing skills (7): `segment`, `docker`, `kubernetes`, `plaid`, `square`, `discord`, `meilisearch`.

Featured still missing skills: none.

Featured still missing packages: none.

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
| anthropic | 9 | 2 | 1 | — | — |
| aws | 12 | 2 | 1 | — | — |
| google-cloud | 10 | 2 | 1 | — | — |
| azure | 10 | 2 | 1 | — | — |
| cloudflare | 5 | 2 | 3 | java | java |
| twilio | 8 | 2 | 1 | typescript | typescript |
| supabase | 8 | 2 | 1 | go, java | go, java |
| firebase | 10 | 3 | 1 | — | — |
| vercel | 3 | 1 | 1 | — | python, go, java |
| ai-sdk | 3 | 1 | 1 | — | python, go, java |
| sentry | 14 | 3 | 1 | — | — |
| datadog | 9 | 4 | 1 | typescript | typescript |
| auth0 | 11 | 3 | 1 | — | — |
| clerk | 8 | 1 | 1 | — | java |
| better-auth | 3 | 1 | 1 | — | python, go, java |
| resend | 8 | 1 | 1 | — | — |
| sendgrid | 8 | 2 | 3 | typescript | typescript |
| posthog | 12 | 3 | 1 | — | — |
| segment | 11 | 3 | 0 | — | — |
| planetscale | 8 | 1 | 3 | — | — |
| neon | 5 | 1 | 1 | java | java |
| prisma | 3 | 1 | 1 | — | python, go, java |
| drizzle | 3 | 1 | 2 | — | python, go, java |
| mongodb | 13 | 2 | 1 | — | — |
| redis | 10 | 2 | 1 | — | — |
| pinecone | 6 | 2 | 1 | — | — |
| algolia | 12 | 2 | 3 | — | — |
| mapbox | 5 | 2 | 3 | python, nodejs, go | python, nodejs, go |
| google-maps | 9 | 3 | 1 | — | — |
| cloudinary | 12 | 2 | 3 | — | — |
| mux | 9 | 2 | 1 | — | — |
| github | 8 | 1 | 1 | — | — |
| gitlab | 6 | 3 | 2 | java | java |
| docker | 6 | 2 | 0 | typescript | typescript |
| kubernetes | 8 | 3 | 0 | — | — |
| terraform | 1 | 2 | 3 | python, nodejs, typescript, java | python, nodejs, typescript, java |
| pulumi | 7 | 2 | 3 | — | — |
| langchain | 4 | 2 | 1 | go, java | go, java |
| llamaindex | 4 | 2 | 2 | go, java | go, java |
| huggingface | 4 | 1 | 1 | go, java | go, java |
| google-genai | 7 | 2 | 1 | — | — |
| plaid | 6 | 2 | 0 | typescript | typescript |
| square | 8 | 2 | 0 | typescript | typescript |
| shopify | 8 | 2 | 3 | go | go |
| slack | 6 | 3 | 3 | go | go |
| discord | 9 | 2 | 0 | — | — |
| stripe-terminal | 5 | 1 | 1 | python, nodejs, go | python, nodejs, go |
| launchdarkly | 13 | 2 | 1 | — | — |
| workos | 9 | 2 | 1 | — | — |
| linear | 3 | 1 | 2 | python, go, java | python, go, java |
| notion | 4 | 1 | 1 | go, java | go, java |
| airtable | 3 | 1 | 3 | python, go, java | python, go, java |
| openai-agents | 4 | 2 | 2 | go, java | go, java |
| crewai | 1 | 1 | 3 | nodejs, typescript, go, java | nodejs, typescript, go, java |
| meilisearch | 12 | 2 | 0 | — | — |
| upstash | 4 | 1 | 4 | go, java | go, java |
| turso | 8 | 2 | 2 | java | java |

## 3. Notes

- Low-confidence / community-only skill matches were skipped for: segment, docker, kubernetes, plaid, discord, meilisearch.
- `square` had no usable payments skill in proposals (`noSkillFound`).
- GitHub uses medium-confidence `gh-cli` (awesome-copilot) — not a dedicated Octokit REST skill.
- Source proposals: `src/data/skills-proposals.json`, `src/data/packages-proposals.json`.
