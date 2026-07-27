import { categories } from "./categories";
import { languages } from "./languages";
import { mcps } from "./mcps";
import { plugins } from "./plugins";
import { sdks } from "./sdks";
import { searchCatalog } from "../lib/catalog";
import type { LanguageId, SdkEntry } from "../types/catalog";

export { categories, languages, mcps, plugins, sdks };
export { getCategory } from "./categories";
export { getLanguage } from "./languages";

export function getSdkBySlug(slug: string): SdkEntry | undefined {
  return sdks.find((sdk) => sdk.slug === slug);
}

export function getPluginBySlug(slug: string): SdkEntry | undefined {
  return plugins.find((plugin) => plugin.slug === slug);
}

export function getMcpBySlug(slug: string): SdkEntry | undefined {
  return mcps.find((mcp) => mcp.slug === slug);
}

export function getSdksByLanguage(languageId: LanguageId): SdkEntry[] {
  return sdks
    .filter((sdk) => sdk.languages.includes(languageId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedSdks(): SdkEntry[] {
  return sdks.filter((sdk) => sdk.featured).sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedPlugins(): SdkEntry[] {
  return plugins
    .filter((plugin) => plugin.featured)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedMcps(): SdkEntry[] {
  return mcps
    .filter((mcp) => mcp.featured)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getLanguageCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const lang of languages) {
    counts[lang.id] = 0;
  }
  for (const sdk of sdks) {
    for (const lang of sdk.languages) {
      counts[lang] = (counts[lang] ?? 0) + 1;
    }
  }
  return counts;
}

export function searchSdks(query: string, languageId?: LanguageId): SdkEntry[] {
  const q = query.trim().toLowerCase();
  let results = sdks;
  let langFilter = languageId;

  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
  const langTokens: string[] = [];
  const textTokens: string[] = [];

  for (const token of tokens) {
    const lang = resolveLanguageToken(token);
    if (lang) {
      langTokens.push(token);
      // Last language token wins when none was passed explicitly
      if (!languageId) langFilter = lang;
    } else {
      textTokens.push(token);
    }
  }

  if (langFilter) {
    results = results.filter((sdk) => sdk.languages.includes(langFilter));
  }

  if (!q) {
    return [...results].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Language-only query (e.g. "python") — show that language's SDKs
  if (textTokens.length === 0 && langTokens.length > 0) {
    return [...results].sort((a, b) => a.name.localeCompare(b.name));
  }

  return results
    .map((sdk) => {
      const name = sdk.name.toLowerCase();
      const vendor = sdk.vendor.toLowerCase();
      const haystack = [
        sdk.name,
        sdk.vendor,
        sdk.description,
        sdk.slug,
        ...(sdk.tags ?? []),
        ...sdk.categories,
        ...sdk.languages,
        ...(sdk.packages?.map((pkg) => pkg.name) ?? []),
        ...(sdk.skills?.map((skill) => skill.name) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      // Every non-language token must match
      if (!textTokens.every((token) => haystack.includes(token))) {
        return { sdk, score: 0 };
      }

      const primary = textTokens[0] ?? q;
      let score = 0;
      if (name === primary || name === q) score += 100;
      else if (name.startsWith(primary)) score += 50;
      else if (name.includes(primary)) score += 30;
      if (vendor.includes(primary)) score += 20;
      for (const token of textTokens) {
        if (haystack.includes(token)) score += 10;
      }
      if (langFilter && sdk.languages.includes(langFilter)) score += 5;
      return { sdk, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.sdk.name.localeCompare(b.sdk.name))
    .map((row) => row.sdk);
}

export function searchPlugins(query: string): SdkEntry[] {
  return searchCatalog(plugins, query);
}

export function searchMcps(query: string): SdkEntry[] {
  return searchCatalog(mcps, query);
}

function resolveLanguageToken(token: string): LanguageId | undefined {
  const t = token.toLowerCase();
  for (const lang of languages) {
    if (lang.id === t) return lang.id;
    if (lang.name.toLowerCase() === t) return lang.id;
    if (lang.shortName.toLowerCase() === t) return lang.id;
    if (lang.aliases?.some((alias) => alias.toLowerCase() === t)) {
      return lang.id;
    }
  }
  return undefined;
}
