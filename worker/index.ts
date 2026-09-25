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
import { clientHint } from "./analytics";
import { AgentStats } from "./agent-stats";
import { AgentReviews } from "./reviews";
import { readPublicStats, recordAgentUsage } from "./usage";
import { searchCatalog, relatedApiLinks, publicCatalogEntry } from "./catalog";
import {
  llmsFullTxt,
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
import type { PublicAgentStats } from "../src/types/agent-stats";

/**
 * Edge API for the catalog. Seed data mirrors the SPA; skill bodies are
 * snapshotted and returned inline on skill endpoints.
 */
export { AgentStats, AgentReviews };

export default {
  async fetch(request, env, ctx): Promise<Response> {
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
      const stats = await readPublicStats(env);
      return text(llmsTxt(origin, stats), "text/plain; charset=utf-8");
    }
    if (url.pathname === "/llms-full.txt") {
      return text(llmsFullTxt(origin), "text/plain; charset=utf-8");
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
      return handleMcpRequest(request, origin, env, ctx);
    }

    if (url.pathname === "/api" || url.pathname === "/api/") {
      const stats = await readPublicStats(env);
      return json(agentDiscovery(origin, stats));
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "sdks.directory" });
    }

    if (url.pathname === "/api/stats") {
      return json(await readPublicStats(env));
    }

    if (url.pathname === "/api/reviews") {
      return handleReviews(request, url, env);
    }

    if (url.pathname === "/api/search") {
      const q = url.searchParams.get("q") ?? "";
      const limit = Number(url.searchParams.get("limit") ?? 25);
      if (!q.trim()) {
        return json({ error: "missing_query", hint: "Pass ?q=" }, 400);
      }
      const started = Date.now();
      const results = searchCatalog(
        origin,
        q,
        Number.isFinite(limit) ? limit : 25,
      );
      recordAgentUsage(env, ctx, {
        event: "search_impression",
        surface: "api",
        tool: "GET /api/search",
        query: q.trim(),
        results: results.items.length,
        slugs: results.items.slice(0, 10).map((item) => item.slug ?? item.id),
        latencyMs: Date.now() - started,
        client: clientHint(request),
      });
      return json(results);
    }

    if (url.pathname === "/api/sdks") {
      return json(listCatalog(sdks, url));
    }

    if (url.pathname.startsWith("/api/sdks/")) {
      return detailCatalog(sdks, url, "sdk", env, ctx, request);
    }

    if (url.pathname === "/api/plugins") {
      return json(listCatalog(plugins, url, { language: false }));
    }

    if (url.pathname.startsWith("/api/plugins/")) {
      return detailCatalog(plugins, url, "plugin", env, ctx, request);
    }

    if (url.pathname === "/api/mcps") {
      return json(listCatalog(mcps, url, { language: false }));
    }

    if (url.pathname.startsWith("/api/mcps/")) {
      return detailCatalog(mcps, url, "mcp", env, ctx, request);
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
        recordAgentUsage(env, ctx, {
          event: "detail_pull",
          surface: "api",
          tool: "GET /api/skills/:sdk/:name",
          kind: "skill",
          slugs: [`${sdkSlug}/${skillName}`],
          results: 1,
          client: clientHint(request),
        });
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
      recordAgentUsage(env, ctx, {
        event: "detail_pull",
        surface: "api",
        tool: "GET /api/skills/:sdk/:name",
        kind: "skill",
        slugs: [`${sdkSlug}/${skillName}`],
        results: 1,
        client: clientHint(request),
      });
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
      const stats =
        url.pathname === "/" || url.pathname === ""
          ? await readPublicStats(env)
          : null;
      const markdown = pageMarkdown(origin, url.pathname, stats);
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
  opts: { language?: boolean } = {},
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
      const base = publicCatalogEntry(item);
      return {
        ...base,
        skills: (item.skills ?? []).map((skill) =>
          enrichSkill(skill, item.slug, { includeBody }),
        ),
      };
    }),
  };
}

function detailCatalog(
  items: SdkEntry[],
  url: URL,
  kind: string,
  env: Env,
  ctx: ExecutionContext,
  request: Request,
): Response {
  const started = Date.now();
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
  const includeBody =
    wantsBody(url, true) || (kind === "sdk" && wantsAgentView(url));
  const base = publicCatalogEntry(item);
  const payload = {
    ...base,
    generatedAt: skillBodiesMeta().generatedAt,
    related: relatedApiLinks(url.origin, item),
    skills: (item.skills ?? []).map((skill) =>
      enrichSkill(skill, item.slug, { includeBody }),
    ),
  };
  recordAgentUsage(env, ctx, {
    event: "detail_pull",
    surface: "api",
    tool: `GET ${prefix}:slug`,
    kind,
    slugs: [slug],
    results: 1,
    latencyMs: Date.now() - started,
    client: clientHint(request),
  });
  return json(payload);
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

function agentDiscovery(origin: string, stats: PublicAgentStats) {
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
    totalLookups: stats.totalLookups,
    stats,
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
      stats: `${origin}/api/stats`,
      reviews: `${origin}/api/reviews`,
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
      "Start with GET /api/search?q= to find SDKs, plugins, MCPs, and skills in one call. Hits include install, transport, auth, remoteUrl, and related slugs.",
      "Prefer GET /api/skills/{sdk}/{name} — response includes `content` (full SKILL.md).",
      "Use GET /api/sdks/{slug}?view=agent for one-shot SDK + skill bodies + related plugin/MCP.",
      "GET /api/mcps/{slug} and get_mcp return transport, auth, remoteUrl, install, and related SDK/plugin.",
      "Connect the catalog MCP at POST /api/mcp (tools: search_catalog, get_sdk, get_skill, get_plugin, get_mcp, leave_review).",
      'Leave a review with POST /api/reviews {"agent":"claude","stars":5,"body":"One or two lines."}. The site assigns a public handle like claude-482913. GET /api/reviews lists them. Recent reviews also appear on the homepage.',
      "Plain curl of / (no Accept: text/html) returns the catalog as markdown. /llms-full.txt lists every slug.",
      "Attribution: skill.url is the upstream source; content is a snapshot for agent use.",
      "Auth: public API — see /auth.md. No OAuth required.",
      "GET /api/stats returns public agent lookup counts. `totalLookups` is the all-time total (API + MCP, not human page views).",
    ],
    skillBodies: skillBodiesMeta(),
  };
}

async function handleReviews(
  request: Request,
  url: URL,
  env: Env,
): Promise<Response> {
  if (request.method === "GET") {
    const limit = Number(url.searchParams.get("limit") ?? 20);
    try {
      return json(
        await env.AGENT_REVIEWS.getByName("public").list(
          Number.isFinite(limit) ? limit : 20,
        ),
        200,
        "public, max-age=30",
      );
    } catch {
      return json({ error: "reviews_unavailable" }, 503);
    }
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const raw = await request.text();
  if (raw.length > 4096) {
    return json({ error: "body_long" }, 413, "no-store");
  }
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json(
      { error: "invalid_json", hint: "Send a JSON object." },
      400,
      "no-store",
    );
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ error: "invalid_json" }, 400, "no-store");
  }
  const body = payload as Record<string, unknown>;
  try {
    const result = await env.AGENT_REVIEWS.getByName("public").submit({
      agentRaw: typeof body.agent === "string" ? body.agent : null,
      stars: body.stars,
      body: body.body,
      userAgent: request.headers.get("User-Agent") ?? "",
      ip: request.headers.get("CF-Connecting-IP") ?? "",
    });
    if (!result.ok) {
      return json(
        { error: result.error, hint: result.hint },
        result.status,
        "no-store",
      );
    }
    return json({ review: result.review }, 201, "no-store");
  } catch {
    return json({ error: "reviews_unavailable" }, 503, "no-store");
  }
}

function json(
  data: unknown,
  status = 200,
  cacheControl = "public, max-age=60",
): Response {
  const body = JSON.stringify(data);
  const etag = `"${fnv1a(body)}"`;
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
