import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SdkGrid } from "../components/SdkGrid";
import { DropdownSelect } from "../components/ui/dropdown-select";
import { Section, SectionHead } from "../components/ui/section";
import { categories } from "../data";
import type { CategoryId, PluginPlatform, SdkEntry } from "../types/catalog";

const fieldClass =
  "h-11 w-full rounded-sm border border-hairline-strong bg-surface-card px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const pluginPlatforms: { id: PluginPlatform; label: string }[] = [
  { id: "claude", label: "Claude" },
  { id: "cursor", label: "Cursor" },
  { id: "copilot", label: "Copilot" },
];

export function CatalogBrowsePage({
  kind,
  title,
  description,
  search,
  emptyMessage,
  showPlatformFilter = false,
}: {
  kind: "plugin" | "mcp";
  title: string;
  description: string;
  search: (query: string) => SdkEntry[];
  emptyMessage: string;
  showPlatformFilter?: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<CategoryId | "">(
    (params.get("category") as CategoryId) || "",
  );
  const [platform, setPlatform] = useState<PluginPlatform | "">(
    (params.get("platform") as PluginPlatform) || "",
  );

  useEffect(() => {
    document.title = `${title} · sdks.directory`;
  }, [title]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category) next.set("category", category);
    if (showPlatformFilter && platform) next.set("platform", platform);
    setParams(next, { replace: true });
  }, [query, category, platform, showPlatformFilter, setParams]);

  const results = useMemo(() => {
    let list = search(query);
    if (category) {
      list = list.filter((item) => item.categories.includes(category));
    }
    if (showPlatformFilter && platform) {
      list = list.filter((item) => item.platforms?.includes(platform));
    }
    return list;
  }, [query, category, platform, search, showPlatformFilter]);

  const categoryOptions = useMemo(
    () => [
      { value: "" as const, label: "All categories" },
      ...categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    ],
    [],
  );

  const platformOptions = useMemo(
    () => [
      { value: "" as const, label: "All platforms" },
      ...pluginPlatforms.map((item) => ({
        value: item.id,
        label: item.label,
      })),
    ],
    [],
  );

  const unit = kind === "plugin" ? "plugin" : "MCP";

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead eyebrow="Catalog" title={title} description={description} />

      <div
        className={
          showPlatformFilter
            ? "mb-5 grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_1fr]"
            : "mb-5 grid grid-cols-1 gap-2 md:grid-cols-[1.6fr_1fr]"
        }
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, vendor, tag…"
          aria-label={`Filter ${title}`}
          className={fieldClass}
        />
        <DropdownSelect
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder="All categories"
          aria-label="Filter by category"
        />
        {showPlatformFilter ? (
          <DropdownSelect
            value={platform}
            onChange={setPlatform}
            options={platformOptions}
            placeholder="All platforms"
            aria-label="Filter by platform"
          />
        ) : null}
      </div>

      <p className="mb-4 text-sm text-muted">
        {results.length} {unit}
        {results.length === 1 ? "" : "s"}
      </p>
      <SdkGrid sdks={results} emptyMessage={emptyMessage} />
    </Section>
  );
}
