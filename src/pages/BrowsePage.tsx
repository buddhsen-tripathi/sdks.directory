import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SdkGrid } from "../components/SdkGrid";
import { TechIcon } from "../components/TechIcon";
import { DropdownSelect } from "../components/ui/dropdown-select";
import { Section, SectionHead } from "../components/ui/section";
import { categories, languages, searchSdks } from "../data";
import type { CategoryId, LanguageId } from "../types/catalog";

const fieldClass =
  "h-11 w-full rounded-sm border border-hairline-strong bg-surface-card px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [language, setLanguage] = useState<LanguageId | "">(
    (params.get("language") as LanguageId) || "",
  );
  const [category, setCategory] = useState<CategoryId | "">(
    (params.get("category") as CategoryId) || "",
  );

  useEffect(() => {
    document.title = "Browse SDKs · sdks.directory";
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (language) next.set("language", language);
    if (category) next.set("category", category);
    setParams(next, { replace: true });
  }, [query, language, category, setParams]);

  const results = useMemo(() => {
    let list = searchSdks(query, language || undefined);
    if (category) {
      list = list.filter((sdk) => sdk.categories.includes(category));
    }
    return list;
  }, [query, language, category]);

  const languageOptions = useMemo(
    () => [
      { value: "" as const, label: "All languages" },
      ...languages.map((lang) => ({
        value: lang.id,
        label: lang.name,
        icon: (
          <TechIcon languageId={lang.id} size={14} color={lang.color} />
        ),
      })),
    ],
    [],
  );

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

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead
        eyebrow="Catalog"
        title="Browse SDKs"
        description="Search the full index. Language and category are filters."
      />

      <div className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_1fr]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, vendor, tag…"
          aria-label="Filter SDKs"
          className={fieldClass}
        />
        <DropdownSelect
          value={language}
          onChange={setLanguage}
          options={languageOptions}
          placeholder="All languages"
          aria-label="Filter by language"
        />
        <DropdownSelect
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder="All categories"
          aria-label="Filter by category"
        />
      </div>

      {language ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-sm bg-surface-card px-3 py-1.5 text-sm text-body ring-1 ring-hairline">
          <TechIcon
            languageId={language}
            size={14}
            color={languages.find((l) => l.id === language)?.color}
          />
          Filtering {languages.find((l) => l.id === language)?.name}
        </div>
      ) : null}

      <p className="mb-4 text-sm text-muted">
        {results.length} SDK{results.length === 1 ? "" : "s"}
      </p>
      <SdkGrid sdks={results} />
    </Section>
  );
}
