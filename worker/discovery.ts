import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
import { skillBodiesMeta } from "./skills";
import { mcpServerCard } from "./mcp";

export function robotsTxt(origin: string): string {
  return `# sdks.directory — agents: start at ${origin}/llms.txt and ${origin}/api
User-agent: *
Allow: /
Allow: /api/
Allow: /llms.txt
Allow: /openapi.json
Allow: /sitemap.xml
Allow: /.well-known/
Allow: /auth.md
Content-Signal: ai-train=no, search=yes, ai-input=yes

Sitemap: ${origin}/sitemap.xml

# Prefer the JSON API over scraping the SPA HTML.
# Discovery: ${origin}/api
# API catalog: ${origin}/.well-known/api-catalog
# Search: ${origin}/api/search?q=
# Skills with bodies: ${origin}/api/skills/{sdk}/{name}
# Catalog MCP: ${origin}/api/mcp
# Content Signals: https://contentsignals.org/
`;
}

export function llmsTxt(origin: string): string {
  return `# sdks.directory

> Official SDKs, agent plugins, MCP servers, and skills. Skill responses include full SKILL.md content.

## For agents

Start here:

- Discovery JSON: ${origin}/api
- API catalog: ${origin}/.well-known/api-catalog
- OpenAPI: ${origin}/openapi.json
- Unified search: ${origin}/api/search?q=
- Catalog MCP: ${origin}/api/mcp
- Skills index: ${origin}/.well-known/agent-skills/index.json
- MCP card: ${origin}/.well-known/mcp.json
- Auth: ${origin}/auth.md (public API; no OAuth)
- Health: ${origin}/api/health
- Coverage: ${origin}/api/coverage

### Search everything

\`\`\`
GET /api/search?q=stripe&limit=20
\`\`\`

Returns ranked SDKs, plugins, MCPs, and skills in one payload.

### Fetch a single skill (preferred)

\`\`\`
GET /api/skills/stripe/stripe-best-practices
\`\`\`

Response includes \`content\` (full SKILL.md) when a snapshot exists, plus \`url\` / \`install\`.

Raw markdown:

\`\`\`
GET /api/skills/stripe/stripe-best-practices.md
Accept: text/markdown
\`\`\`

### SDKs / plugins / MCPs

\`\`\`
GET /api/sdks?withSkills=1&q=auth
GET /api/sdks/stripe?view=agent
GET /api/plugins?q=stripe&platform=claude
GET /api/mcps?category=database
GET /api/mcps/github
\`\`\`

\`view=agent\` on SDK detail includes skill bodies and is the one-shot happy path.

### Catalog MCP tools

POST JSON-RPC to \`/api/mcp\`: \`search_catalog\`, \`get_sdk\`, \`get_skill\`, \`get_plugin\`, \`get_mcp\`.

## Human site

- SDKs: \`/\`, \`/browse\`, \`/sdk/{slug}\`
- Plugins: \`/plugins\`, \`/plugin/{slug}\`
- MCPs: \`/mcps\`, \`/mcp/{slug}\`

## Notes

Skill bodies are snapshotted from upstream (skills.sh / GitHub). Attribution: skill.url. Plugins and MCPs are curated seeds, not a raw registry dump.
Generated: ${skillBodiesMeta().generatedAt}
`;
}

export function sitemapXml(origin: string): string {
  const urls: string[] = [
    `${origin}/`,
    `${origin}/llms.txt`,
    `${origin}/openapi.json`,
    `${origin}/api`,
    `${origin}/api/health`,
    `${origin}/api/search`,
    `${origin}/api/sdks`,
    `${origin}/api/plugins`,
    `${origin}/api/mcps`,
    `${origin}/api/skills`,
    `${origin}/api/coverage`,
    `${origin}/api/languages`,
    `${origin}/api/categories`,
    `${origin}/api/mcp`,
    `${origin}/.well-known/mcp.json`,
    `${origin}/.well-known/llms.txt`,
    `${origin}/.well-known/api-catalog`,
    `${origin}/.well-known/agent-skills/index.json`,
    `${origin}/auth.md`,
    `${origin}/browse`,
    `${origin}/plugins`,
    `${origin}/mcps`,
  ];

  for (const sdk of sdks) {
    urls.push(`${origin}/api/sdks/${sdk.slug}`);
    urls.push(`${origin}/sdk/${sdk.slug}`);
    for (const skill of sdk.skills ?? []) {
      urls.push(
        `${origin}/api/skills/${encodeURIComponent(sdk.slug)}/${encodeURIComponent(skill.name)}`,
      );
    }
  }
  for (const plugin of plugins) {
    urls.push(`${origin}/api/plugins/${plugin.slug}`);
    urls.push(`${origin}/plugin/${plugin.slug}`);
  }
  for (const mcp of mcps) {
    urls.push(`${origin}/api/mcps/${mcp.slug}`);
    urls.push(`${origin}/mcp/${mcp.slug}`);
  }

  const body = urls
    .map(
      (loc) => `  <url>
    <loc>${escapeXml(loc)}</loc>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function wellKnownMcp(origin: string) {
  return mcpServerCard(origin);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
