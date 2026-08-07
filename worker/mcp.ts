import { mcps } from "../src/data/mcps";
import { plugins } from "../src/data/plugins";
import { sdks } from "../src/data/sdks";
import type { AgentEvent } from "./analytics";
import { clientHint, recordAgentEvent } from "./analytics";
import { searchCatalog, withAgentFields } from "./catalog";
import { enrichSkill } from "./skills";

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: JsonRpcId;
  method?: string;
  params?: Record<string, unknown>;
};

type McpSession = {
  dataset?: AnalyticsEngineDataset;
  client?: string;
};

type ToolOutcome = {
  result: ReturnType<typeof textResult> | ReturnType<typeof toolError>;
  analytics?: Omit<AgentEvent, "surface" | "client" | "latencyMs">;
};

const SERVER_INFO = {
  name: "sdks.directory",
  version: "1.0.0",
};

const TOOLS = [
  {
    name: "search_catalog",
    description:
      "Search official SDKs, agent plugins, MCP servers, and skills in sdks.directory.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Search query" },
        limit: { type: "number", description: "Max hits (1-50)", default: 15 },
      },
      required: ["q"],
    },
  },
  {
    name: "get_sdk",
    description:
      "Get one SDK by slug, including package refs and skill metadata. Skill bodies included.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "SDK slug, e.g. stripe" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_skill",
    description:
      "Get one agent skill by sdk slug + skill name, including full SKILL.md content when snapshotted.",
    inputSchema: {
      type: "object",
      properties: {
        sdk: { type: "string", description: "Owning SDK slug" },
        name: { type: "string", description: "Skill name" },
      },
      required: ["sdk", "name"],
    },
  },
  {
    name: "get_plugin",
    description: "Get one agent plugin by slug, including install hint and platforms.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Plugin slug" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_mcp",
    description:
      "Get one MCP server by slug, including install, transport, auth, and remoteUrl when known.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "MCP slug" },
      },
      required: ["slug"],
    },
  },
] as const;

function textResult(data: unknown) {
  return {
    content: [
      {
        type: "text",
        text:
          typeof data === "string" ? data : JSON.stringify(data, null, 2),
      },
    ],
  };
}

function toolError(message: string) {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

function callTool(
  origin: string,
  name: string,
  args: Record<string, unknown>,
): ToolOutcome {
  switch (name) {
    case "search_catalog": {
      const q = String(args.q ?? "").trim();
      if (!q) return { result: toolError("Missing required argument: q") };
      const limit = Number(args.limit ?? 15);
      const search = searchCatalog(
        origin,
        q,
        Number.isFinite(limit) ? limit : 15,
      );
      return {
        result: textResult(search),
        analytics: {
          event: "search_impression",
          tool: name,
          query: q,
          results: search.items.length,
          slugs: search.items
            .slice(0, 10)
            .map((item) => item.slug ?? item.id),
        },
      };
    }
    case "get_sdk": {
      const slug = String(args.slug ?? "").trim();
      const sdk = sdks.find((item) => item.slug === slug);
      if (!sdk) return { result: toolError(`SDK not found: ${slug}`) };
      return {
        result: textResult({
          ...sdk,
          skills: sdk.skills?.map((skill) =>
            enrichSkill(skill, sdk.slug, { includeBody: true }),
          ),
        }),
        analytics: {
          event: "detail_pull",
          tool: name,
          kind: "sdk",
          slugs: [slug],
          results: 1,
        },
      };
    }
    case "get_skill": {
      const sdkSlug = String(args.sdk ?? "").trim();
      const skillName = String(args.name ?? "").trim();
      const sdk = sdks.find((item) => item.slug === sdkSlug);
      const skill = sdk?.skills?.find((item) => item.name === skillName);
      if (!sdk || !skill) {
        return { result: toolError(`Skill not found: ${sdkSlug}/${skillName}`) };
      }
      return {
        result: textResult(enrichSkill(skill, sdk.slug, { includeBody: true })),
        analytics: {
          event: "detail_pull",
          tool: name,
          kind: "skill",
          slugs: [`${sdkSlug}/${skillName}`],
          results: 1,
        },
      };
    }
    case "get_plugin": {
      const slug = String(args.slug ?? "").trim();
      const plugin = plugins.find((item) => item.slug === slug);
      if (!plugin) return { result: toolError(`Plugin not found: ${slug}`) };
      return {
        result: textResult(plugin),
        analytics: {
          event: "detail_pull",
          tool: name,
          kind: "plugin",
          slugs: [slug],
          results: 1,
        },
      };
    }
    case "get_mcp": {
      const slug = String(args.slug ?? "").trim();
      const mcp = mcps.find((item) => item.slug === slug);
      if (!mcp) return { result: toolError(`MCP not found: ${slug}`) };
      return {
        result: textResult(withAgentFields(mcp)),
        analytics: {
          event: "detail_pull",
          tool: name,
          kind: "mcp",
          slugs: [slug],
          results: 1,
        },
      };
    }
    default:
      return { result: toolError(`Unknown tool: ${name}`) };
  }
}

function handleMessage(
  origin: string,
  message: JsonRpcRequest,
  session: McpSession,
) {
  const id = message.id ?? null;
  const method = message.method ?? "";
  const params = (message.params ?? {}) as Record<string, unknown>;

  if (method === "initialize") {
    const clientInfo = params.clientInfo as
      | { name?: string; version?: string }
      | undefined;
    const client = [clientInfo?.name, clientInfo?.version]
      .filter(Boolean)
      .join("/");
    if (client) session.client = client;
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-03-26",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          "sdks.directory catalog MCP. Prefer get_skill for full SKILL.md. Use search_catalog to discover SDKs, plugins, MCPs, and skills.",
      },
    };
  }

  if (method.startsWith("notifications/") || method === "initialized") {
    return null;
  }

  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    };
  }

  if (method === "tools/call") {
    const name = String(params.name ?? "");
    const args = (params.arguments ?? {}) as Record<string, unknown>;
    const started = Date.now();
    const { result, analytics } = callTool(origin, name, args);
    if (analytics && !("isError" in result && result.isError)) {
      recordAgentEvent(session.dataset, {
        ...analytics,
        surface: "mcp",
        client: session.client,
        latencyMs: Date.now() - started,
      });
    }
    return {
      jsonrpc: "2.0",
      id,
      result,
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export function mcpServerCard(origin: string) {
  return {
    name: "io.github.buddhsen-tripathi/sdks-directory",
    description:
      "Search official SDKs, agent plugins, MCP servers, and skill bodies from sdks.directory.",
    version: "1.0.0",
    remotes: [
      {
        type: "streamable-http",
        url: `${origin}/api/mcp`,
      },
    ],
  };
}

export async function handleMcpRequest(
  request: Request,
  origin: string,
  dataset?: AnalyticsEngineDataset,
): Promise<Response> {
  if (request.method === "GET") {
    return Response.json(
      {
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        transport: "streamable-http",
        documentation: `${origin}/llms.txt`,
        tools: TOOLS.map((tool) => tool.name),
        hint: "POST JSON-RPC messages (initialize, tools/list, tools/call).",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60",
        },
      },
    );
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      },
      { status: 400 },
    );
  }

  const messages = Array.isArray(payload) ? payload : [payload];
  const session: McpSession = { dataset, client: clientHint(request) };
  const responses = messages
    .map((message) =>
      handleMessage(origin, message as JsonRpcRequest, session),
    )
    .filter((message) => message !== null);

  const body = Array.isArray(payload) ? responses : responses[0] ?? {};
  return Response.json(body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Accept, MCP-Protocol-Version",
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}
