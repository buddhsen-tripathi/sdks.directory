import { useParams } from "react-router-dom";
import {
  CatalogEntryDetail,
  CatalogMissingDetail,
} from "../components/CatalogEntryDetail";
import { getSdkBySlug } from "../data";

export function SdkDetailPage() {
  const { slug = "" } = useParams();
  const sdk = getSdkBySlug(slug);
  if (!sdk) return <CatalogMissingDetail kind="sdk" slug={slug} />;
  return <CatalogEntryDetail kind="sdk" entry={sdk} />;
}
