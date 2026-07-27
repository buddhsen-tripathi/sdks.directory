import { Link, useSearchParams } from "react-router-dom";
import { SdkGrid } from "../components/SdkGrid";
import { Section, SectionHead } from "../components/ui/section";
import { searchSdks } from "../data";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const results = searchSdks(q);

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead
        eyebrow="Search"
        title={q ? `Results for “${q}”` : "Search SDKs"}
        description={
          <>
            {results.length} match{results.length === 1 ? "" : "es"}.{" "}
            <Link to="/browse" className="text-ink hover:text-primary">
              Open full browse →
            </Link>
          </>
        }
      />
      <SdkGrid
        sdks={results}
        emptyMessage={
          q
            ? `Nothing matched “${q}”. Try a vendor, language, or package name.`
            : "Type a query in the header search."
        }
      />
    </Section>
  );
}
