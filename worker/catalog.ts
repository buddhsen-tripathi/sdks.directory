import { categories } from "../src/data/categories";
import { languages } from "../src/data/languages";
import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
import { relatedCatalog, withAgentFields } from "../src/lib/catalog";
import { enrichSkill, skillBodiesMeta } from "./skills";
import type { SdkEntry } from "../src/types/catalog";

export { withAgentFields };

export function relatedApiLinks(origin: string, entry: SdkEntry) {
  const related = relatedCatalog(entry);
  return {
    ...(related.sdk
      ? {
          sdk: {
            slug: related.sdk.slug,
            name: related.sdk.name,
            url: `${origin}/api/sdks/${related.sdk.slug}?view=agent`,
          },
        }
      : {}),
    ...(related.plugin
      ? {
          plugin: {
            slug: related.plugin.slug,
            name: related.plugin.name,
            url: `${origin}/api/plugins/${related.plugin.slug}`,
          },
        }
      : {}),
    ...(related.mcp
      ? {
          mcp: {
            slug: related.mcp.slug,
            name: related.mcp.name,
            url: `${origin}/api/mcps/${related.mcp.slug}`,
          },
        }
      : {}),
  };
}

export type SearchHit = {
  kind: "sdk" | "plugin" | "mcp" | "skill";
  score: number;
  id: string;
  name: string;
  slug?: string;
  vendor?: string;
  description?: string;
  url: string;
  install?: string;
  sdk?: string;
  hasContent?: boolean;
  platforms?: string[];
  transport?: SdkEntry["transport"];
  auth?: SdkEntry["auth"];
  remoteUrl?: string;
  related?: ReturnType<typeof relatedApiLinks>;
};

function scoreText(query: string, fields: string[]): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const tokens = q.split(/\s+/).filter(Boolean);
  const name = (fields[0] ?? "").toLowerCase();
  const haystack = fields.join(" ").toLowerCase();
  if (!tokens.every((token) => haystack.includes(token))) return 0;

  const primary = tokens[0] ?? q;
  let score = 10;
  if (name === primary || name === q) score += 100;
  else if (name.startsWith(primary)) score += 50;
  else if (name.includes(primary)) score += 30;
  for (const token of tokens) {
    if (haystack.includes(token)) score += 8;
  }
  return score;
}

export function searchCatalog(origin: string, query: string, limit = 25) {
  const hits: SearchHit[] = [];
  const q = query.trim();

  for (const sdk of sdks) {
    const score = scoreText(q, [
      sdk.name,
      sdk.vendor,
      sdk.description,
      sdk.slug,
      ...(sdk.tags ?? []),
      ...sdk.categories,
      ...sdk.languages,
      ...(sdk.packages?.map((pkg) => pkg.name) ?? []),
      ...(sdk.skills?.map((skill) => skill.name) ?? []),
    ]);
    if (score > 0) {
      hits.push({
        kind: "sdk",
        score,
        id: sdk.id,
        name: sdk.name,
        slug: sdk.slug,
        vendor: sdk.vendor,
        description: sdk.description,
        url: `${origin}/api/sdks/${sdk.slug}`,
        related: relatedApiLinks(origin, sdk),
      });
    }

    for (const skill of sdk.skills ?? []) {
      const enriched = enrichSkill(skill, sdk.slug);
      const skillScore = scoreText(q, [
        skill.name,
        sdk.name,
        sdk.slug,
        enriched.description ?? "",
        skill.install ?? "",
      ]);
      if (skillScore > 0) {
        hits.push({
          kind: "skill",
          score: skillScore + (enriched.hasContent ? 5 : 0),
          id: `${sdk.slug}/${skill.name}`,
          name: skill.name,
          slug: skill.name,
          sdk: sdk.slug,
          description: enriched.description,
          url: `${origin}/api/skills/${sdk.slug}/${skill.name}`,
          install: skill.install,
          hasContent: enriched.hasContent,
        });
      }
    }
  }

  for (const plugin of plugins) {
    const score = scoreText(q, [
      plugin.name,
      plugin.vendor,
      plugin.description,
      plugin.slug,
      plugin.install ?? "",
      ...(plugin.tags ?? []),
      ...(plugin.platforms ?? []),
      ...(plugin.packages?.map((pkg) => pkg.name) ?? []),
    ]);
    if (score > 0) {
      hits.push({
        kind: "plugin",
        score,
        id: plugin.id,
        name: plugin.name,
        slug: plugin.slug,
        vendor: plugin.vendor,
        description: plugin.description,
        url: `${origin}/api/plugins/${plugin.slug}`,
        install: plugin.install,
        platforms: plugin.platforms,
        related: relatedApiLinks(origin, plugin),
      });
    }
  }

  for (const mcp of mcps) {
    const enriched = withAgentFields(mcp);
    const score = scoreText(q, [
      mcp.name,
      mcp.vendor,
      mcp.description,
      mcp.slug,
      mcp.registryName ?? "",
      mcp.install ?? "",
      mcp.remoteUrl ?? "",
      ...(mcp.tags ?? []),
      ...(mcp.packages?.map((pkg) => pkg.name) ?? []),
    ]);
    if (score > 0) {
      hits.push({
        kind: "mcp",
        score,
        id: mcp.id,
        name: mcp.name,
        slug: mcp.slug,
        vendor: mcp.vendor,
        description: mcp.description,
        url: `${origin}/api/mcps/${mcp.slug}`,
        install: enriched.install,
        transport: enriched.transport,
        auth: enriched.auth,
        remoteUrl: enriched.remoteUrl,
        related: relatedApiLinks(origin, mcp),
      });
    }
  }

  hits.sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name),
  );

  const seen = new Set<string>();
  const unique: SearchHit[] = [];
  for (const hit of hits) {
    const key = `${hit.kind}:${hit.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(hit);
  }

  return {
    q,
    count: unique.length,
    items: unique.slice(0, Math.max(1, Math.min(limit, 100))),
  };
}

export function catalogStats() {
  return {
    sdks: sdks.length,
    plugins: plugins.length,
    mcps: mcps.length,
    languages: languages.length,
    categories: categories.length,
    skillBodies: skillBodiesMeta(),
  };
}
