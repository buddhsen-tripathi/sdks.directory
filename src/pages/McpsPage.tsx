import { searchMcps } from "../data";
import { CatalogBrowsePage } from "./CatalogBrowsePage";

export function McpsPage() {
  return (
    <CatalogBrowsePage
      kind="mcp"
      title="Browse MCPs"
      description="Official MCP servers with transport, auth, and a remote URL when agents can connect over HTTP."
      search={searchMcps}
      emptyMessage="No MCP servers match these filters."
    />
  );
}
