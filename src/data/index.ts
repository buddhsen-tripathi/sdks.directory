import { categories } from "./categories";
import { languages } from "./languages";
import { sdks } from "./sdks";
import type { LanguageId, SdkEntry } from "../types/catalog";

export { categories, languages, sdks };
export { getCategory } from "./categories";
export { getLanguage } from "./languages";

export function getSdkBySlug(slug: string): SdkEntry | undefined {
  return sdks.find((sdk) => sdk.slug === slug);
}

export function getSdksByLanguage(languageId: LanguageId): SdkEntry[] {
  return sdks
    .filter((sdk) => sdk.languages.includes(languageId))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getFeaturedSdks(): SdkEntry[] {
  return sdks.filter((sdk) => sdk.featured).sort((a, b) => a.name.localeCompare(b.name));
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

  if (languageId) {
    results = results.filter((sdk) => sdk.languages.includes(languageId));
  }

  if (!q) {
    return [...results].sort((a, b) => a.name.localeCompare(b.name));
  }

  return results
    .map((sdk) => {
      const haystack = [
        sdk.name,
        sdk.vendor,
        sdk.description,
        sdk.slug,
        ...(sdk.tags ?? []),
        ...sdk.categories,
        ...sdk.languages,
        ...(sdk.packages?.map((pkg) => pkg.name) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      if (sdk.name.toLowerCase() === q) score += 100;
      else if (sdk.name.toLowerCase().startsWith(q)) score += 50;
      else if (sdk.name.toLowerCase().includes(q)) score += 30;
      if (sdk.vendor.toLowerCase().includes(q)) score += 20;
      if (haystack.includes(q)) score += 10;
      return { sdk, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.sdk.name.localeCompare(b.sdk.name))
    .map((row) => row.sdk);
}
