export type AgentEventKind = "search_impression" | "detail_pull";

export type AgentEvent = {
  event: AgentEventKind;
  surface: "mcp" | "api";
  tool: string;
  kind?: string;
  query?: string;
  slugs?: string[];
  results?: number;
  latencyMs?: number;
  client?: string;
};

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export function recordAgentEvent(
  dataset: AnalyticsEngineDataset | undefined,
  event: AgentEvent,
): void {
  if (!dataset) return;
  try {
    dataset.writeDataPoint({
      blobs: [
        event.event,
        event.surface,
        event.tool,
        event.kind ?? "",
        truncate(event.query ?? "", 120),
        truncate((event.slugs ?? []).slice(0, 10).join(","), 512),
        truncate(event.client ?? "", 60),
      ],
      doubles: [event.results ?? 0, event.latencyMs ?? 0],
      indexes: [event.event],
    });
  } catch {
  }
}

export function clientHint(request: Request): string {
  return truncate(request.headers.get("User-Agent") ?? "", 60);
}
