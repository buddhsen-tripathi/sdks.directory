import { searchPlugins } from "../data";
import { CatalogBrowsePage } from "./CatalogBrowsePage";

export function PluginsPage() {
  return (
    <CatalogBrowsePage
      kind="plugin"
      title="Browse plugins"
      description="Installable agent packages: skills, MCP servers, and rules indexed like SDKs."
      search={searchPlugins}
      emptyMessage="No plugins match these filters."
      showPlatformFilter
    />
  );
}
