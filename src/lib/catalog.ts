import type { CatalogKind, SdkEntry } from "../types/catalog";

const kindMeta: Record<
  CatalogKind,
  { label: string; plural: string; listPath: string; detailPrefix: string }
> = {
  sdk: {
    label: "SDK",
    plural: "SDKs",
    listPath: "/browse",
    detailPrefix: "/sdk",
  },
  plugin: {
    label: "Plugin",
    plural: "Plugins",
    listPath: "/plugins",
    detailPrefix: "/plugin",
  },
  mcp: {
    label: "MCP",
    plural: "MCPs",
    listPath: "/mcps",
    detailPrefix: "/mcp",
  },
};

export function catalogKindMeta(kind: CatalogKind) {
  return kindMeta[kind];
}

export function catalogListPath(kind: CatalogKind): string {
  return kindMeta[kind].listPath;
}

export function catalogDetailPath(
  entry: Pick<SdkEntry, "kind" | "slug">,
): string {
  return `${kindMeta[entry.kind].detailPrefix}/${entry.slug}`;
}

export function searchCatalog(
  items: SdkEntry[],
  query: string,
): SdkEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }

  const tokens = q.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      const name = item.name.toLowerCase();
      const vendor = item.vendor.toLowerCase();
      const haystack = [
        item.name,
        item.vendor,
        item.description,
        item.slug,
        item.registryName ?? "",
        item.install ?? "",
        ...(item.tags ?? []),
        ...(item.platforms ?? []),
        ...item.categories,
        ...item.languages,
        ...(item.packages?.map((pkg) => pkg.name) ?? []),
        ...(item.skills?.map((skill) => skill.name) ?? []),
      ]
        .join(" ")
        .toLowerCase();

      if (!tokens.every((token) => haystack.includes(token))) {
        return { item, score: 0 };
      }

      const primary = tokens[0] ?? q;
      let score = 0;
      if (name === primary || name === q) score += 100;
      else if (name.startsWith(primary)) score += 50;
      else if (name.includes(primary)) score += 30;
      if (vendor.includes(primary)) score += 20;
      for (const token of tokens) {
        if (haystack.includes(token)) score += 10;
      }
      return { item, score };
    })
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.item.name.localeCompare(b.item.name),
    )
    .map((row) => row.item);
}
