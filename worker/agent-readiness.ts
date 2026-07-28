import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
import { getSkillBody, skillBodiesMeta } from "./skills";

/** RFC 8288 Link values advertised on the homepage and HTML shell. */
export function discoveryLinkHeader(): string {
  return [
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    '</openapi.json>; rel="service-desc"; type="application/json"',
    '</llms.txt>; rel="service-doc"; type="text/plain"',
    '</api>; rel="service-doc"; type="application/json"',
    '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
    '</auth.md>; rel="describedby"; type="text/markdown"',
    '</.well-known/mcp.json>; rel="alternate"; type="application/json"',
  ].join(", ");
}

/** RFC 9727 API catalog (application/linkset+json). */
export function apiCatalog(origin: string) {
  return {
    linkset: [
      {
        anchor: `${origin}/api`,
        "service-desc": [
          {
            href: `${origin}/openapi.json`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${origin}/llms.txt`,
            type: "text/plain",
          },
          {
            href: `${origin}/api`,
            type: "application/json",
          },
        ],
        status: [
          {
            href: `${origin}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}

export function authMd(origin: string): string {
  return `# auth.md

sdks.directory does **not** require authentication for its public catalog APIs.

## Audience

AI agents, MCP clients, and developers discovering official SDKs, plugins, MCP servers, and skill bodies.

## Registration

No agent registration, OAuth client registration, or API keys are required.

- Catalog JSON API: \`${origin}/api\`
- OpenAPI: \`${origin}/openapi.json\`
- Catalog MCP (JSON-RPC): \`${origin}/api/mcp\`
- Skill markdown: \`${origin}/api/skills/{sdk}/{name}.md\`

## Credentials

None. All listed endpoints are open with CORS \`Access-Control-Allow-Origin: *\`.

## Methods

| Method | Status | Notes |
|--------|--------|-------|
| Anonymous / public GET | Supported | Preferred path for agents |
| OAuth 2.0 / OIDC | Not used | No protected resource; no authorization server |
| API keys | Not used | |

If this policy changes, OAuth Protected Resource Metadata will be published at \`/.well-known/oauth-protected-resource\` and this document will be updated.
`;
}

export function wantsMarkdown(accept: string): boolean {
  if (!/\btext\/markdown\b/i.test(accept)) return false;
  const mdQ = qValue(accept, "text/markdown");
  const htmlQ = /\btext\/html\b/i.test(accept)
    ? qValue(accept, "text/html")
    : 0;
  return mdQ >= htmlQ;
}

function qValue(accept: string, type: string): number {
  const re = new RegExp(
    `${type.replace("/", "\\/")}\\s*(?:;\\s*q=([0-9.]+))?`,
    "i",
  );
  const match = re.exec(accept);
  if (!match) return 0;
  return match[1] ? Number(match[1]) : 1;
}

export function pageMarkdown(origin: string, pathname: string): string | null {
  if (pathname === "/" || pathname === "") {
    return homeMarkdown(origin);
  }

  const sdkMatch = pathname.match(/^\/sdk\/([^/]+)\/?$/);
  if (sdkMatch) {
    const sdk = sdks.find((s) => s.slug === sdkMatch[1]);
    if (!sdk) return null;
    return entryMarkdown(origin, "sdk", sdk);
  }

  const pluginMatch = pathname.match(/^\/plugin\/([^/]+)\/?$/);
  if (pluginMatch) {
    const plugin = plugins.find((p) => p.slug === pluginMatch[1]);
    if (!plugin) return null;
    return entryMarkdown(origin, "plugin", plugin);
  }

  const mcpMatch = pathname.match(/^\/mcp\/([^/]+)\/?$/);
  if (mcpMatch) {
    const mcp = mcps.find((m) => m.slug === mcpMatch[1]);
    if (!mcp) return null;
    return entryMarkdown(origin, "mcp", mcp);
  }

  if (pathname === "/browse") {
    return listMarkdown(origin, "SDKs", "sdk", sdks);
  }
  if (pathname === "/plugins") {
    return listMarkdown(origin, "Plugins", "plugin", plugins);
  }
  if (pathname === "/mcps") {
    return listMarkdown(origin, "MCP servers", "mcp", mcps);
  }
  if (pathname === "/search") {
    return `# Search

Use the JSON API instead of scraping this page:

\`\`\`
GET ${origin}/api/search?q=YOUR_QUERY&limit=25
\`\`\`

Also: ${origin}/llms.txt
`;
  }

  return null;
}

function homeMarkdown(origin: string): string {
  const featured = sdks.filter((s) => s.featured).slice(0, 8);
  return `---
title: sdks.directory
description: Official SDKs, agent plugins, MCP servers, and skills.
---

# sdks.directory

Official SDKs, agent plugins, MCP servers, and skills. Prefer the JSON API over HTML.

## Agent discovery

- API catalog: ${origin}/.well-known/api-catalog
- OpenAPI: ${origin}/openapi.json
- Discovery JSON: ${origin}/api
- Search: ${origin}/api/search?q=
- Catalog MCP: ${origin}/api/mcp
- Skills index: ${origin}/.well-known/agent-skills/index.json
- llms.txt: ${origin}/llms.txt
- auth.md: ${origin}/auth.md (public API; no OAuth)

## Featured SDKs

${featured.map((s) => `- [${s.name}](${origin}/sdk/${s.slug}) — ${s.description}`).join("\n")}

## Browse

- SDKs: ${origin}/browse
- Plugins: ${origin}/plugins
- MCPs: ${origin}/mcps
`;
}

function listMarkdown(
  origin: string,
  title: string,
  kind: "sdk" | "plugin" | "mcp",
  items: { slug: string; name: string; description: string }[],
): string {
  const prefix =
    kind === "sdk" ? "sdk" : kind === "plugin" ? "plugin" : "mcp";
  const api =
    kind === "sdk"
      ? `${origin}/api/sdks`
      : kind === "plugin"
        ? `${origin}/api/plugins`
        : `${origin}/api/mcps`;
  return `---
title: ${title} · sdks.directory
---

# ${title}

Machine-readable list: ${api}

${items.map((item) => `- [${item.name}](${origin}/${prefix}/${item.slug}): ${item.description}`).join("\n")}
`;
}

function entryMarkdown(
  origin: string,
  kind: "sdk" | "plugin" | "mcp",
  item: {
    slug: string;
    name: string;
    description: string;
    homepage?: string;
    docsUrl?: string;
    skills?: { name: string }[];
  },
): string {
  const apiPath =
    kind === "sdk"
      ? `/api/sdks/${item.slug}`
      : kind === "plugin"
        ? `/api/plugins/${item.slug}`
        : `/api/mcps/${item.slug}`;
  const skills =
    item.skills
      ?.map(
        (s) =>
          `- [${s.name}](${origin}/api/skills/${item.slug}/${s.name}.md)`,
      )
      .join("\n") ?? "";
  return `---
title: ${item.name} · sdks.directory
description: ${item.description}
---

# ${item.name}

${item.description}

- API: ${origin}${apiPath}${kind === "sdk" ? "?view=agent" : ""}
- Website: ${item.homepage ?? "n/a"}
- Docs: ${item.docsUrl ?? "n/a"}

${skills ? `## Skills\n\n${skills}\n` : ""}`;
}

export type AgentSkillIndexEntry = {
  name: string;
  type: "skill-md";
  description: string;
  url: string;
  digest: string;
};

export async function agentSkillsIndex(
  origin: string,
): Promise<{ $schema: string; skills: AgentSkillIndexEntry[] }> {
  const skills: AgentSkillIndexEntry[] = [];

  for (const sdk of sdks) {
    for (const skill of sdk.skills ?? []) {
      const body = getSkillBody(sdk.slug, skill.name);
      const markdown = skillMarkdownArtifact(sdk.slug, skill.name, skill, body);
      const name = discoverySkillName(sdk.slug, skill.name);
      const digest = await sha256Hex(markdown);
      skills.push({
        name,
        type: "skill-md",
        description:
          (body?.description || `${skill.name} for ${sdk.name}`).slice(0, 1024),
        url: `${origin}/.well-known/agent-skills/${name}/SKILL.md`,
        digest: `sha256:${digest}`,
      });
    }
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills,
  };
}

export function getDiscoverySkillMarkdown(
  discoveryName: string,
): string | null {
  for (const sdk of sdks) {
    for (const skill of sdk.skills ?? []) {
      if (discoverySkillName(sdk.slug, skill.name) !== discoveryName) continue;
      const body = getSkillBody(sdk.slug, skill.name);
      return skillMarkdownArtifact(sdk.slug, skill.name, skill, body);
    }
  }
  return null;
}

function discoverySkillName(sdk: string, name: string): string {
  const raw = `${sdk}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return raw.slice(0, 64).replace(/-$/g, "") || "skill";
}

function skillMarkdownArtifact(
  sdk: string,
  name: string,
  skill: { url: string; install?: string },
  body: { content: string; description?: string } | undefined,
): string {
  if (body?.content?.trim()) {
    const content = body.content.trim();
    if (content.startsWith("---")) return content;
    return `---
name: ${discoverySkillName(sdk, name)}
description: ${(body.description || name).replace(/\n/g, " ").slice(0, 1024)}
---

${content}
`;
  }

  return `---
name: ${discoverySkillName(sdk, name)}
description: ${name.replace(/\n/g, " ").slice(0, 1024)}
---

# ${name}

Upstream skill for \`${sdk}\`. Snapshot content is not available yet.

- Source: ${skill.url}
- Install: ${skill.install ?? "n/a"}
- API: /api/skills/${sdk}/${name}
- Generated: ${skillBodiesMeta().generatedAt}
`;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function estimateMarkdownTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}
