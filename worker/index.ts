import { categories } from "../src/data/categories";
import { languages } from "../src/data/languages";
import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
import {
  agentSkillsIndex,
  apiCatalog,
  authMd,
  discoveryLinkHeader,
  estimateMarkdownTokens,
  getDiscoverySkillMarkdown,
  pageMarkdown,
  wantsMarkdown,
} from "./agent-readiness";
import { searchCatalog, withAgentFields } from "./catalog";
import {
  llmsTxt,
  robotsTxt,
  sitemapXml,
  wellKnownMcp,
} from "./discovery";
import { handleMcpRequest } from "./mcp";
import { openApiDocument } from "./openapi";
import {
  enrichSkill,
  getSkillBody,
  skillBodiesMeta,
  skillKey,
} from "./skills";
import type { SdkEntry } from "../src/types/catalog";

/**
 * Edge API for the catalog. Seed data mirrors the SPA; skill bodies are
 * snapshotted and returned inline on skill endpoints.
 */
export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") ?? "";
    const origin = url.origin;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(true) });
    }

    // Agent discovery surfaces (must not fall through to SPA HTML)
    if (url.pathname === "/robots.txt") {
      return text(robotsTxt(origin), "text/plain; charset=utf-8");
    }
    if (url.pathname === "/llms.txt" || url.pathname === "/.well-known/llms.txt") {
      return text(llmsTxt(origin), "text/plain; charset=utf-8");
    }
    if (url.pathname === "/sitemap.xml") {
      return text(sitemapXml(origin), "application/xml; charset=utf-8");
    }
    if (url.pathname === "/auth.md") {
      return text(authMd(origin), "text/markdown; charset=utf-8");
    }
    if (url.pathname === "/.well-known/api-catalog") {
      return linkset(apiCatalog(origin));
    }
    if (url.pathname === "/.well-known/agent-skills/index.json") {
      return json(await agentSkillsIndex(origin));
    }
    const skillMdMatch = url.pathname.match(
      /^\/\.well-known\/agent-skills\/([^/]+)\/SKILL\.md\/?$/,
    );
    if (skillMdMatch) {
      const markdown = getDiscoverySkillMarkdown(
        decodeURIComponent(skillMdMatch[1]),
      );
      if (!markdown) {
        return json({ error: "not_found" }, 404);
      }
      return text(markdown, "text/markdown; charset=utf-8");
    }
    if (
      url.pathname === "/.well-known/mcp.json" ||
      url.pathname === "/.well-known/mcp/server-card.json"
    ) {
      return json(wellKnownMcp(origin));
    }
    if (url.pathname === "/openapi.json") {
      return json(openApiDocument(origin));
    }

    if (url.pathname === "/api/mcp" || url.pathname === "/api/mcp/") {
      return handleMcpRequest(request, origin);
    }

    if (url.pathname === "/api" || url.pathname === "/api/") {
      return json(agentDiscovery(origin));
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "sdks.directory" });
    }

    if (url.pathname === "/api/search") {
      const q = url.searchParams.get("q") ?? "";
      const limit = Number(url.searchParams.get("limit") ?? 25);
      if (!q.trim()) {
        return json({ error: "missing_query", hint: "Pass ?q=" }, 400);
      }
      return json(searchCatalog(origin, q, Number.isFinite(limit) ? limit : 25));
    }

    if (url.pathname === "/api/sdks") {
      return json(listCatalog(sdks, url));
    }

    if (url.pathname.startsWith("/api/sdks/")) {
      return detailCatalog(sdks, url, "sdk");
    }

    if (url.pathname === "/api/plugins") {
      return json(listCatalog(plugins, url, { language: false, enrichAgent: true }));
    }

    if (url.pathname.startsWith("/api/plugins/")) {
      return detailCatalog(plugins, url, "plugin");
    }

    if (url.pathname === "/api/mcps") {
      return json(listCatalog(mcps, url, { language: false, enrichAgent: true }));
    }

    if (url.pathname.startsWith("/api/mcps/")) {
      return detailCatalog(mcps, url, "mcp");
    }

    if (url.pathname === "/api/skills") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const sdkSlug = url.searchParams.get("sdk") ?? undefined;
      const language = url.searchParams.get("language") ?? undefined;
      const includeBody = wantsBody(url);
      const withContent = url.searchParams.get("withContent");

      let items = sdks.flatMap((sdk) =>
        (sdk.skills ?? []).map((skill) =>
          enrichSkill(skill, sdk.slug, { includeBody }),
        ),
      );

      if (sdkSlug) {
        items = items.filter((item) => item.sdk === sdkSlug);
      }
      if (language) {
        items = items.filter(
          (item) =>
            !item.languages?.length ||
            item.languages.includes(language as never),
        );
      }
      if (withContent === "1" || withContent === "true") {
        items = items.filter((item) => item.hasContent);
      }
      if (q) {
        items = items.filter((item) => {
          const blob = [
            item.name,
            item.sdk,
            item.url,
            item.description ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return blob.includes(q);
        });
      }

      return json({
        count: items.length,
        bodies: skillBodiesMeta(),
        items,
      });
    }

    const skillMatch = url.pathname.match(
      /^\/api\/skills\/([^/]+)\/([^/]+?)(\.md)?\/?$/,
    );
    if (skillMatch) {
      const sdkSlug = decodeURIComponent(skillMatch[1]);
      const skillName = decodeURIComponent(skillMatch[2]);
      const asMarkdown =
        Boolean(skillMatch[3]) || accept.includes("text/markdown");
      const sdk = sdks.find((item) => item.slug === sdkSlug);
      const skill = sdk?.skills?.find((s) => s.name === skillName);
      if (!sdk || !skill) {
        return json(
          { error: "not_found", key: skillKey(sdkSlug, skillName) },
          404,
        );
      }

      const body = getSkillBody(sdkSlug, skillName);
      if (asMarkdown) {
        if (!body?.content) {
          return new Response(
            `# Skill content unavailable\n\nUpstream: ${skill.url}\nInstall: ${skill.install ?? "n/a"}\n`,
            {
              status: 404,
              headers: {
                ...corsHeaders(),
                "Content-Type": "text/markdown; charset=utf-8",
              },
            },
          );
        }
        return new Response(body.content, {
          headers: {
            ...corsHeaders(),
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            ETag: `"skill-${sdkSlug}-${skillName}-${body.fetchedAt}"`,
          },
        });
      }

      const enriched = enrichSkill(skill, sdk.slug, { includeBody: true });
      return json(enriched);
    }

    if (url.pathname === "/api/coverage") {
      const total = sdks.length;
      const withSkills = sdks.filter((s) => (s.skills?.length ?? 0) > 0).length;
      const withPackages = sdks.filter(
        (s) => (s.packages?.length ?? 0) > 0,
      ).length;
      const bodies = skillBodiesMeta();
      return json({
        generatedAt: bodies.generatedAt,
        total,
        withSkills,
        withPackages,
        skillsCoverage: total ? Number((withSkills / total).toFixed(3)) : 0,
        packagesCoverage: total ? Number((withPackages / total).toFixed(3)) : 0,
        skillBodies: bodies.count,
        skillBodiesMissing: bodies.failed,
        missingSkills: sdks
          .filter((s) => !(s.skills?.length ?? 0))
          .map((s) => s.slug),
        plugins: plugins.length,
        mcps: mcps.length,
      });
    }

    if (url.pathname === "/api/languages") {
      return json({ items: languages });
    }

    if (url.pathname === "/api/categories") {
      return json({ items: categories });
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "not_found" }, 404);
    }

    // Markdown-for-agents content negotiation on HTML catalog pages
    if (request.method === "GET" && wantsMarkdown(accept)) {
      const markdown = pageMarkdown(origin, url.pathname);
      if (markdown) {
        return new Response(markdown, {
          headers: {
            ...corsHeaders(),
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=300",
            Vary: "Accept",
            Link: discoveryLinkHeader(),
            "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
            "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
          },
        });
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withDiscoveryHeaders(assetResponse, url.pathname);
  },
} satisfies ExportedHandler<Env>;

function withDiscoveryHeaders(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);
  const contentType = headers.get("Content-Type") ?? "";
  const isHtmlShell =
    pathname === "/" ||
    contentType.includes("text/html") ||
    (!pathname.includes(".") && response.status === 200);

  if (isHtmlShell || pathname === "/") {
    headers.delete("Link");
    headers.set("Link", discoveryLinkHeader());
    headers.set("Content-Signal", "ai-train=no, search=yes, ai-input=yes");
    const vary = headers.get("Vary");
    headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function listCatalog(
  items: SdkEntry[],
  url: URL,
  opts: { language?: boolean; enrichAgent?: boolean } = {},
) {
  const language = url.searchParams.get("language");
  const category = url.searchParams.get("category");
  const platform = url.searchParams.get("platform");
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const withSkills = url.searchParams.get("withSkills");
  const includeBody = wantsBody(url);

  let results = items;

  if (opts.language !== false && language) {
    results = results.filter((item) =>
      item.languages.includes(language as never),
    );
  }
  if (category) {
    results = results.filter((item) =>
      item.categories.includes(category as never),
    );
  }
  if (platform) {
    results = results.filter((item) =>
      item.platforms?.includes(platform as never),
    );
  }
  if (withSkills === "1" || withSkills === "true") {
    results = results.filter((item) => (item.skills?.length ?? 0) > 0);
  }
  if (q) {
    results = results.filter((item) => {
      const blob = [
        item.name,
        item.vendor,
        item.description,
        item.slug,
        item.registryName ?? "",
        item.install ?? "",
        ...(item.tags ?? []),
        ...(item.platforms ?? []),
        ...(item.skills?.map((s) => s.name) ?? []),
        ...(item.packages?.map((p) => p.name) ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }

  return {
    count: results.length,
    generatedAt: skillBodiesMeta().generatedAt,
    items: results.map((item) => {
      const base =
        opts.enrichAgent || item.kind === "mcp" ? withAgentFields(item) : item;
      return {
        ...base,
        skills: base.skills?.map((skill) =>
          enrichSkill(skill, item.slug, { includeBody }),
        ),
      };
    }),
  };
}

function detailCatalog(items: SdkEntry[], url: URL, kind: string): Response {
  const prefix =
    kind === "sdk"
      ? "/api/sdks/"
      : kind === "plugin"
        ? "/api/plugins/"
        : "/api/mcps/";
  const slug = url.pathname.replace(prefix, "").replace(/\/$/, "");
  if (slug.includes("/")) {
    return json({ error: "not_found" }, 404);
  }
  const item = items.find((entry) => entry.slug === slug);
  if (!item) {
    return json({ error: "not_found" }, 404);
  }
  const agent = wantsAgentView(url) || kind !== "sdk";
  const includeBody =
    wantsBody(url, true) || (kind === "sdk" && wantsAgentView(url));
  const base = agent ? withAgentFields(item) : item;
  return json({
    ...base,
    generatedAt: skillBodiesMeta().generatedAt,
    skills: base.skills?.map((skill) =>
      enrichSkill(skill, item.slug, { includeBody }),
    ),
  });
}

function wantsBody(url: URL, defaultOnDetail = false): boolean {
  const v = url.searchParams.get("include");
  if (v === "body" || v === "content") return true;
  if (url.searchParams.get("body") === "1") return true;
  return defaultOnDetail;
}

function wantsAgentView(url: URL): boolean {
  const view = url.searchParams.get("view");
  return view === "agent" || view === "1";
}

function agentDiscovery(origin: string) {
  return {
    name: "sdks.directory",
    description:
      "sdks.directory — official SDKs, agent plugins, MCP servers, and skills. Skill endpoints return SKILL.md content inline.",
    documentation: `${origin}/llms.txt`,
    openapi: `${origin}/openapi.json`,
    apiCatalog: `${origin}/.well-known/api-catalog`,
    agentSkills: `${origin}/.well-known/agent-skills/index.json`,
    auth: `${origin}/auth.md`,
    mcp: `${origin}/api/mcp`,
    endpoints: {
      discovery: `${origin}/api`,
      health: `${origin}/api/health`,
      search: `${origin}/api/search?q=&limit=25`,
      sdks: `${origin}/api/sdks?q=&language=&category=&withSkills=1&include=body`,
      sdk: `${origin}/api/sdks/{slug}?view=agent`,
      plugins: `${origin}/api/plugins?q=&category=&platform=`,
      plugin: `${origin}/api/plugins/{slug}`,
      mcps: `${origin}/api/mcps?q=&category=`,
      mcpEntry: `${origin}/api/mcps/{slug}`,
      skills: `${origin}/api/skills?sdk=&q=&withContent=1&include=body`,
      skill: `${origin}/api/skills/{sdk}/{name}`,
      skillMarkdown: `${origin}/api/skills/{sdk}/{name}.md`,
      coverage: `${origin}/api/coverage`,
      languages: `${origin}/api/languages`,
      categories: `${origin}/api/categories`,
      catalogMcp: `${origin}/api/mcp`,
      openapi: `${origin}/openapi.json`,
      apiCatalog: `${origin}/.well-known/api-catalog`,
      agentSkills: `${origin}/.well-known/agent-skills/index.json`,
      auth: `${origin}/auth.md`,
    },
    agentHints: [
      "Start with GET /api/search?q= to find SDKs, plugins, MCPs, and skills in one call.",
      "Prefer GET /api/skills/{sdk}/{name} — response includes `content` (full SKILL.md).",
      "Use GET /api/sdks/{slug}?view=agent for one-shot SDK + skill bodies.",
      "Connect the catalog MCP at POST /api/mcp (tools: search_catalog, get_sdk, get_skill, get_plugin, get_mcp).",
      "Use Accept: text/markdown on HTML pages for Markdown-for-Agents responses.",
      "Attribution: skill.url is the upstream source; content is a snapshot for agent use.",
      "Auth: public API — see /auth.md. No OAuth required.",
    ],
    skillBodies: skillBodiesMeta(),
  };
}

function json(data: unknown, status = 200): Response {
  const body = JSON.stringify(data);
  const etag = `"${fnv1a(body)}"`;
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
      ETag: etag,
    },
  });
}

function linkset(data: unknown): Response {
  const body = JSON.stringify(data);
  return new Response(body, {
    headers: {
      ...corsHeaders(),
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      "Cache-Control": "public, max-age=300",
      Link: discoveryLinkHeader(),
    },
  });
}

function text(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      ...corsHeaders(),
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  });
}

function corsHeaders(mcp = false): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": mcp
      ? "GET, POST, OPTIONS"
      : "GET, OPTIONS",
    "Access-Control-Allow-Headers": mcp
      ? "Content-Type, Accept, MCP-Protocol-Version"
      : "Content-Type, Accept",
    "Cache-Control": "public, max-age=60",
  };
}

function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}
