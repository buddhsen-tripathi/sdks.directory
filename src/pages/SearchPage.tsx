import { Link, useSearchParams } from "react-router-dom";
import { SdkGrid } from "../components/SdkGrid";
import { Section, SectionHead } from "../components/ui/section";
import { searchMcps, searchPlugins, searchSdks } from "../data";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const sdks = searchSdks(q);
  const plugins = searchPlugins(q);
  const mcps = searchMcps(q);
  const total = sdks.length + plugins.length + mcps.length;

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead
        eyebrow="Search"
        title={q ? `Results for “${q}”` : "Search the directory"}
        description={
          <>
            {total} match{total === 1 ? "" : "es"} across SDKs, plugins, and
            MCPs.{" "}
            <Link to="/browse" className="text-ink hover:text-primary">
              Browse SDKs →
            </Link>
          </>
        }
      />

      {sdks.length > 0 ? (
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-ink">
            SDKs ({sdks.length})
          </h2>
          <SdkGrid sdks={sdks} />
        </div>
      ) : null}

      {plugins.length > 0 ? (
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-ink">
            Plugins ({plugins.length})
          </h2>
          <SdkGrid sdks={plugins} />
        </div>
      ) : null}

      {mcps.length > 0 ? (
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-ink">
            MCPs ({mcps.length})
          </h2>
          <SdkGrid sdks={mcps} />
        </div>
      ) : null}

      {total === 0 ? (
        <SdkGrid
          sdks={[]}
          emptyMessage={
            q
              ? `Nothing matched “${q}”. Try a vendor, language, plugin, or MCP name.`
              : "Type a query in the header search."
          }
        />
      ) : null}
    </Section>
  );
}
