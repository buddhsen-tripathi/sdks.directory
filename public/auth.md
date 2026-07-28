# auth.md

sdks.directory does **not** require authentication for its public catalog APIs.

## Audience

AI agents, MCP clients, and developers discovering official SDKs, plugins, MCP servers, and skill bodies.

## Registration

No agent registration, OAuth client registration, or API keys are required.

- Catalog JSON API: `/api`
- OpenAPI: `/openapi.json`
- Catalog MCP (JSON-RPC): `/api/mcp`
- Skill markdown: `/api/skills/{sdk}/{name}.md`

## Credentials

None. All listed endpoints are open with CORS `Access-Control-Allow-Origin: *`.

## Methods

| Method | Status | Notes |
|--------|--------|-------|
| Anonymous / public GET | Supported | Preferred path for agents |
| OAuth 2.0 / OIDC | Not used | No protected resource; no authorization server |
| API keys | Not used | |

If this policy changes, OAuth Protected Resource Metadata will be published at `/.well-known/oauth-protected-resource` and this document will be updated.
