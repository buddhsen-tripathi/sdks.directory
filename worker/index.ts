import { categories } from "../src/data/categories";
import { languages } from "../src/data/languages";
import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
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
  async fetch(request): Promise<Response> {
    const url = new URL(request.url);
    const accept = request.headers.get("Accept") ?? "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === "/api" || url.pathname === "/api/") {
      return json(agentDiscovery(url.origin));
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "sdks.directory" });
    }

    if (url.pathname === "/api/sdks") {
      return json(listCatalog(sdks, url));
    }

    if (url.pathname.startsWith("/api/sdks/")) {
      return detailCatalog(sdks, url, "sdk");
    }

    if (url.pathname === "/api/plugins") {
      return json(listCatalog(plugins, url, { language: false }));
    }

    if (url.pathname.startsWith("/api/plugins/")) {
      return detailCatalog(plugins, url, "plugin");
    }

    if (url.pathname === "/api/mcps") {
      return json(listCatalog(mcps, url, { language: false }));
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

    // GET /api/skills/:sdk/:name  — full skill payload (content by default)
    // GET /api/skills/:sdk/:name.md — raw SKILL.md
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

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;

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
    items: results.map((item) => ({
      ...item,
      skills: item.skills?.map((skill) =>
        enrichSkill(skill, item.slug, { includeBody }),
      ),
    })),
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
  const includeBody = wantsBody(url, true);
  return json({
    ...item,
    skills: item.skills?.map((skill) =>
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

function agentDiscovery(origin: string) {
  return {
    name: "sdks.directory",
    description:
      "sdks.directory — official SDKs, agent plugins, MCP servers, and skills. Skill endpoints return SKILL.md content inline.",
    documentation: `${origin}/llms.txt`,
    endpoints: {
      discovery: `${origin}/api`,
      health: `${origin}/api/health`,
      sdks: `${origin}/api/sdks?q=&language=&category=&withSkills=1&include=body`,
      sdk: `${origin}/api/sdks/{slug}?include=body`,
      plugins: `${origin}/api/plugins?q=&category=&platform=`,
      plugin: `${origin}/api/plugins/{slug}`,
      mcps: `${origin}/api/mcps?q=&category=`,
      mcp: `${origin}/api/mcps/{slug}`,
      skills: `${origin}/api/skills?sdk=&q=&withContent=1&include=body`,
      skill: `${origin}/api/skills/{sdk}/{name}`,
      skillMarkdown: `${origin}/api/skills/{sdk}/{name}.md`,
      coverage: `${origin}/api/coverage`,
      languages: `${origin}/api/languages`,
      categories: `${origin}/api/categories`,
    },
    agentHints: [
      "Prefer GET /api/skills/{sdk}/{name} — response includes `content` (full SKILL.md).",
      "Use Accept: text/markdown or .md suffix for raw skill text.",
      "List endpoints omit bodies by default; pass include=body when you need them.",
      "Attribution: skill.url is the upstream source; content is a snapshot for agent use.",
      "Plugins and MCPs share the SdkEntry shape (kind: plugin | mcp).",
    ],
    skillBodies: skillBodiesMeta(),
  };
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: corsHeaders(),
  });
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Cache-Control": "public, max-age=60",
  };
}
