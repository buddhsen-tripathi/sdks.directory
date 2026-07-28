import { useEffect } from "react";

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
};

type ModelContext = {
  registerTool?: (tool: WebMcpTool) => void | (() => void);
  provideContext?: (context: { tools: WebMcpTool[] }) => void | (() => void);
};

/**
 * Registers catalog tools for browser agents that support WebMCP.
 * No-ops when navigator.modelContext is unavailable.
 */
export function WebMcpTools() {
  useEffect(() => {
    const modelContext = (
      navigator as Navigator & { modelContext?: ModelContext }
    ).modelContext;
    if (!modelContext) return;

    const tools: WebMcpTool[] = [
      {
        name: "search_catalog",
        description:
          "Search sdks.directory for official SDKs, plugins, MCP servers, and skills.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Search query" },
            limit: {
              type: "number",
              description: "Max results (default 10)",
            },
          },
          required: ["q"],
        },
        async execute({ q, limit }) {
          const params = new URLSearchParams({
            q: String(q ?? ""),
            limit: String(limit ?? 10),
          });
          const res = await fetch(`/api/search?${params}`);
          return res.json();
        },
      },
      {
        name: "get_sdk",
        description: "Fetch one SDK by slug, including skill metadata.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "SDK slug, e.g. stripe" },
          },
          required: ["slug"],
        },
        async execute({ slug }) {
          const res = await fetch(`/api/sdks/${encodeURIComponent(String(slug))}?view=agent`);
          return res.json();
        },
      },
      {
        name: "navigate_catalog",
        description:
          "Navigate the browser to a catalog page (home, browse, plugins, mcps, or an entry).",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description:
                "Path such as /, /browse, /plugins, /mcps, /sdk/stripe, /plugin/..., /mcp/...",
            },
          },
          required: ["path"],
        },
        execute({ path }) {
          const next = String(path ?? "/");
          const safe = next.startsWith("/") ? next : `/${next}`;
          window.location.assign(safe);
          return { ok: true, path: safe };
        },
      },
    ];

    const cleanups: Array<() => void> = [];

    if (typeof modelContext.registerTool === "function") {
      for (const tool of tools) {
        const result = modelContext.registerTool(tool);
        if (typeof result === "function") cleanups.push(result);
      }
    } else if (typeof modelContext.provideContext === "function") {
      const result = modelContext.provideContext({ tools });
      if (typeof result === "function") cleanups.push(result);
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
