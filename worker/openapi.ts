import { catalogStats } from "./catalog";
import { skillBodiesMeta } from "./skills";

export function openApiDocument(origin: string) {
  const stats = catalogStats();
  return {
    openapi: "3.1.0",
    info: {
      title: "sdks.directory API",
      version: "1.0.0",
      description:
        "Official SDKs, agent plugins, MCP servers, and skill bodies. Prefer /api/skills/{sdk}/{name} for full SKILL.md content.",
      contact: { url: origin },
    },
    servers: [{ url: origin }],
    paths: {
      "/api": {
        get: {
          summary: "Agent discovery document",
          operationId: "getDiscovery",
          responses: { "200": { description: "Discovery JSON" } },
        },
      },
      "/api/health": {
        get: {
          summary: "Health check",
          operationId: "getHealth",
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/search": {
        get: {
          summary: "Search SDKs, plugins, MCPs, and skills",
          operationId: "searchCatalog",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 100, default: 25 },
            },
          ],
          responses: { "200": { description: "Ranked hits" } },
        },
      },
      "/api/sdks": {
        get: {
          summary: "List SDKs",
          operationId: "listSdks",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "language", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "withSkills", in: "query", schema: { type: "string" } },
            { name: "include", in: "query", schema: { type: "string", enum: ["body", "content"] } },
            { name: "view", in: "query", schema: { type: "string", enum: ["agent"] } },
          ],
          responses: { "200": { description: "SDK list" } },
        },
      },
      "/api/sdks/{slug}": {
        get: {
          summary: "Get one SDK",
          operationId: "getSdk",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
            { name: "include", in: "query", schema: { type: "string" } },
            { name: "view", in: "query", schema: { type: "string", enum: ["agent"] } },
          ],
          responses: {
            "200": { description: "SDK" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/plugins": {
        get: {
          summary: "List plugins",
          operationId: "listPlugins",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "platform", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "Plugin list" } },
        },
      },
      "/api/plugins/{slug}": {
        get: {
          summary: "Get one plugin",
          operationId: "getPlugin",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Plugin" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/mcps": {
        get: {
          summary: "List MCP servers",
          operationId: "listMcps",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "MCP list" } },
        },
      },
      "/api/mcps/{slug}": {
        get: {
          summary: "Get one MCP server",
          operationId: "getMcp",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "MCP" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/skills": {
        get: {
          summary: "List skills",
          operationId: "listSkills",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "sdk", in: "query", schema: { type: "string" } },
            { name: "language", in: "query", schema: { type: "string" } },
            { name: "withContent", in: "query", schema: { type: "string" } },
            { name: "include", in: "query", schema: { type: "string" } },
          ],
          responses: { "200": { description: "Skill list" } },
        },
      },
      "/api/skills/{sdk}/{name}": {
        get: {
          summary: "Get one skill with SKILL.md content",
          operationId: "getSkill",
          parameters: [
            { name: "sdk", in: "path", required: true, schema: { type: "string" } },
            { name: "name", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Skill with content" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/skills/{sdk}/{name}.md": {
        get: {
          summary: "Raw SKILL.md markdown",
          operationId: "getSkillMarkdown",
          parameters: [
            { name: "sdk", in: "path", required: true, schema: { type: "string" } },
            { name: "name", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "text/markdown" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/coverage": {
        get: {
          summary: "Catalog coverage stats",
          operationId: "getCoverage",
          responses: { "200": { description: "Coverage" } },
        },
      },
      "/api/languages": {
        get: {
          summary: "Language index",
          operationId: "listLanguages",
          responses: { "200": { description: "Languages" } },
        },
      },
      "/api/categories": {
        get: {
          summary: "Category index",
          operationId: "listCategories",
          responses: { "200": { description: "Categories" } },
        },
      },
      "/api/mcp": {
        post: {
          summary: "Catalog MCP (streamable HTTP JSON-RPC)",
          operationId: "mcpJsonRpc",
          responses: { "200": { description: "JSON-RPC response" } },
        },
        get: {
          summary: "Catalog MCP info",
          operationId: "mcpInfo",
          responses: { "200": { description: "MCP endpoint metadata" } },
        },
      },
    },
    "x-sdks-directory": {
      skillBodies: skillBodiesMeta(),
      counts: {
        sdks: stats.sdks,
        plugins: stats.plugins,
        mcps: stats.mcps,
      },
    },
  };
}
