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
      return json({ ok: true, service: "sdks.directory" });
    }

    if (url.pathname === "/api/sdks") {
      const language = url.searchParams.get("language");
      const category = url.searchParams.get("category");
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const withSkills = url.searchParams.get("withSkills");

      let results = sdks;

      if (language) {
        results = results.filter((sdk) =>
          sdk.languages.includes(language as never),
        );
      }
      if (category) {
        results = results.filter((sdk) =>
          sdk.categories.includes(category as never),
        );
      }
      if (withSkills === "1" || withSkills === "true") {
        results = results.filter((sdk) => (sdk.skills?.length ?? 0) > 0);
      }
      if (q) {
        results = results.filter((sdk) => {
          const blob = [
            sdk.name,
            sdk.vendor,
            sdk.description,
            sdk.slug,
            ...(sdk.tags ?? []),
            ...(sdk.skills?.map((s) => s.name) ?? []),
            ...(sdk.packages?.map((p) => p.name) ?? []),
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

    if (url.pathname === "/api/skills") {
      const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
      const sdkSlug = url.searchParams.get("sdk") ?? undefined;
      const language = url.searchParams.get("language") ?? undefined;

      let items = sdks.flatMap((sdk) =>
        (sdk.skills ?? []).map((skill) => ({
          ...skill,
          sdk: sdk.slug,
        })),
      );

      if (sdkSlug) {
        items = items.filter((item) => item.sdk === sdkSlug);
      }
      if (language) {
        items = items.filter(
          (item) =>
            !item.languages?.length ||
            item.languages.includes(language as never),
        );
      }
      if (q) {
        items = items.filter((item) => {
          const blob = [item.name, item.sdk, item.url].join(" ").toLowerCase();
          return blob.includes(q);
        });
      }

      return json({ count: items.length, items });
    }

    if (url.pathname === "/api/coverage") {
      const total = sdks.length;
      const withSkills = sdks.filter((s) => (s.skills?.length ?? 0) > 0).length;
      const withPackages = sdks.filter(
        (s) => (s.packages?.length ?? 0) > 0,
      ).length;
      return json({
        total,
        withSkills,
        withPackages,
        skillsCoverage: total ? Number((withSkills / total).toFixed(3)) : 0,
        packagesCoverage: total ? Number((withPackages / total).toFixed(3)) : 0,
        missingSkills: sdks
          .filter((s) => !(s.skills?.length ?? 0))
          .map((s) => s.slug),
      });
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
