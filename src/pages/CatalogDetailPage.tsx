import { useParams } from "react-router-dom";
import {
  CatalogEntryDetail,
  CatalogMissingDetail,
} from "../components/CatalogEntryDetail";
import { getMcpBySlug, getPluginBySlug } from "../data";

export function PluginDetailPage() {
  const { slug = "" } = useParams();
  const entry = getPluginBySlug(slug);
  if (!entry) return <CatalogMissingDetail kind="plugin" slug={slug} />;
  return <CatalogEntryDetail kind="plugin" entry={entry} />;
}

export function McpDetailPage() {
  const { slug = "" } = useParams();
  const entry = getMcpBySlug(slug);
  if (!entry) return <CatalogMissingDetail kind="mcp" slug={slug} />;
  return <CatalogEntryDetail kind="mcp" entry={entry} />;
}
