# Skills linked to catalog SDKs

Agent skills (`SKILL.md`) collected for vendors/SDKs in (or near) the directory.

Machine index: [`index.json`](index.json).

## Included

| Skill | Path | Catalog slug(s) | Upstream |
|-------|------|-----------------|----------|
| cloudflare | `cloudflare/cloudflare` | cloudflare | cloudflare/skills (+ local) |
| wrangler | `cloudflare/wrangler` | cloudflare | [cloudflare/skills](https://github.com/cloudflare/skills) |
| workers-best-practices | `cloudflare/workers-best-practices` | cloudflare | cloudflare/skills |
| durable-objects | `cloudflare/durable-objects` | cloudflare | cloudflare/skills |
| agents-sdk | `cloudflare/agents-sdk` | cloudflare | [cloudflare/skills](https://github.com/cloudflare/skills) |
| sandbox-sdk | `cloudflare/sandbox-sdk` | cloudflare | cloudflare/skills |
| turnstile-spin | `cloudflare/turnstile-spin` | cloudflare | cloudflare/skills |
| cloudflare-email-service | `cloudflare/cloudflare-email-service` | cloudflare | cloudflare/skills |
| neon-postgres | `neon/neon-postgres` | neon | [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills) |
| drizzle-orm | `drizzle/drizzle-orm` | drizzle | local / community |
| better-auth-best-practices | `better-auth/better-auth-best-practices` | better-auth | better-auth/skills |
| ai-sdk | `ai-sdk/ai-sdk` | ai-sdk | vercel/ai (skills.sh) |
| gemini-api-dev | `gemini/gemini-api-dev` | gemini | local |
| stripe-best-practices | `stripe/stripe-best-practices` | stripe | [stripe/ai](https://github.com/stripe/ai) |
| supabase | `supabase/supabase` | supabase | [supabase/agent-skills](https://github.com/supabase/agent-skills) |
| prisma-client-api | `prisma/prisma-client-api` | prisma | [prisma/skills](https://github.com/prisma/skills) |
| mcp-builder | `mcp/mcp-builder` | — (MCPs vertical) | [anthropics/skills](https://github.com/anthropics/skills) |
| chat-sdk | `chat-sdk/chat-sdk` | _(needs entry)_ | vercel/chat |

Each skill directory includes `SOURCE.md` provenance.

## Find more

```bash
npx skills find <query>
# or
curl "https://skills.sh/api/search?q=<query>"
```

Browse: https://skills.sh/ · notes: [`../sources/skills.md`](../sources/skills.md)
