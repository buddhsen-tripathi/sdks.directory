import { searchMcps } from "../data";
import { CatalogBrowsePage } from "./CatalogBrowsePage";

export function McpsPage() {
  return (
    <CatalogBrowsePage
      kind="mcp"
      title="Browse MCPs"
      description="Model Context Protocol servers agents can connect to. Curated, not a raw registry dump."
      search={searchMcps}
      emptyMessage="No MCP servers match these filters."
    />
  );
}
