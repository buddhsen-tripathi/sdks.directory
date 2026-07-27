import { siteConfig } from "../src/config/site";
import { categories } from "../src/data/categories";
import { languages } from "../src/data/languages";
import { sdks } from "../src/data/sdks";

/**
 * Edge API for the catalog. Today it mirrors the in-repo seed data so the
 * SPA and API stay in lockstep; later this can read from D1 without UI churn.
 */
export default {
  async fetch(request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: siteConfig.name });
    }

    if (url.pathname === "/api/sdks") {
      const language = url.searchParams.get("language");
      const category = url.searchParams.get("category");
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

      let results = sdks;

      if (language) {
        results = results.filter((sdk) => sdk.languages.includes(language as never));
      }
      if (category) {
        results = results.filter((sdk) => sdk.categories.includes(category as never));
      }
      if (q) {
        results = results.filter((sdk) => {
          const blob = [
            sdk.name,
            sdk.vendor,
            sdk.description,
            ...(sdk.tags ?? []),
          ]
            .join(" ")
            .toLowerCase();
          return blob.includes(q);
        });
      }

      return json({
        count: results.length,
        items: results,
      });
    }

    if (url.pathname.startsWith("/api/sdks/")) {
      const slug = url.pathname.replace("/api/sdks/", "");
      const sdk = sdks.find((item) => item.slug === slug);
      if (!sdk) {
        return json({ error: "not_found" }, 404);
      }
      return json(sdk);
    }

    if (url.pathname === "/api/languages") {
      return json({ items: languages });
    }

    if (url.pathname === "/api/categories") {
      return json({ items: categories });
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "not_found" }, 404);
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: corsHeaders(),
  });
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60",
  };
}
