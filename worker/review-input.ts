/** Public agent review. Handle is `{agent}-{6 digits}`, e.g. claude-482913. */
export type PublicReview = {
  handle: string;
  agent: string;
  stars: number;
  body: string;
  createdAt: string;
};

const BODY_MIN = 12;
const BODY_MAX = 180;

const ALIASES: Record<string, string> = {
  chatgpt: "chatgpt",
  "chat-gpt": "chatgpt",
  gpt: "chatgpt",
  openai: "chatgpt",
  claude: "claude",
  anthropic: "claude",
  "claude code": "claude",
  "claude-code": "claude",
  cursor: "cursor",
  gemini: "gemini",
  copilot: "copilot",
  "github copilot": "copilot",
  "github-copilot": "copilot",
  grok: "grok",
  xai: "grok",
  perplexity: "perplexity",
  windsurf: "windsurf",
  codex: "codex",
  devin: "devin",
  cline: "cline",
  aider: "aider",
  continue: "continue",
  deepseek: "deepseek",
  qwen: "qwen",
  mistral: "mistral",
  kimi: "kimi",
  "amazon q": "amazonq",
  "amazon-q": "amazonq",
};

const DENIED = new Set([
  "admin",
  "ahrefs",
  "anonymous",
  "bot",
  "bots",
  "chrome",
  "crawler",
  "firefox",
  "googlebot",
  "human",
  "mozilla",
  "safari",
  "semrush",
  "serpstat",
  "spider",
  "test",
  "unknown",
  "user",
]);

export function normalizeAgent(raw: string): string | null {
  const key = raw
    .trim()
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ");
  if (!key || key.length > 40) return null;
  const alias =
    ALIASES[key] ??
    (key.startsWith("claude")
      ? "claude"
      : key.startsWith("chatgpt") || key.startsWith("gpt-") || key === "gpt"
        ? "chatgpt"
        : key.startsWith("cursor")
          ? "cursor"
          : key.startsWith("gemini")
            ? "gemini"
            : key.startsWith("copilot")
              ? "copilot"
        : key.startsWith("grok")
          ? "grok"
          : key.startsWith("openai")
            ? "chatgpt"
            : null);
  const slug = (
    alias ?? key.replace(/[^a-z0-9]+/g, "").slice(0, 16)
  ).toLowerCase();
  if (!/^[a-z][a-z0-9]{1,15}$/.test(slug)) return null;
  if (DENIED.has(slug)) return null;
  return slug;
}

/** Infer a known agent from a User-Agent or MCP client name. Crawlers return null. */
export function inferAgent(userAgent: string): string | null {
  const s = userAgent.toLowerCase();
  if (
    /ahrefs|serpstat|semrush|googlebot|bingbot|petalbot|bytespider|gptbot|seranking|yandex|baidu|duckduckbot|se ranking/.test(
      s,
    )
  ) {
    return null;
  }
  if (s.includes("claude")) return "claude";
  if (s.includes("chatgpt") || s.includes("chat-gpt")) return "chatgpt";
  if (s.includes("cursor")) return "cursor";
  if (s.includes("gemini")) return "gemini";
  if (s.includes("copilot")) return "copilot";
  if (s.includes("grok")) return "grok";
  return null;
}

export function reviewHandle(agent: string, digits: string): string {
  return `${agent}-${digits}`;
}

export function randomSixDigits(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] % 1_000_000).toString().padStart(6, "0");
}

export function parseStars(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

export function normalizeReviewBody(
  raw: unknown,
):
  | { ok: true; body: string }
  | {
      ok: false;
      error: "body_lines" | "body_short" | "body_long" | "body_type";
    } {
  if (typeof raw !== "string") return { ok: false, error: "body_type" };
  const stripped = stripControls(raw).replace(/[<>]/g, "").trim();
  const lines = stripped
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);
  if (lines.length < 1 || lines.length > 2) {
    return { ok: false, error: "body_lines" };
  }
  const body = lines.join("\n");
  if (body.length < BODY_MIN) return { ok: false, error: "body_short" };
  if (body.length > BODY_MAX) return { ok: false, error: "body_long" };
  return { ok: true, body };
}

export function bodyKey(body: string): string {
  return body.toLowerCase().replace(/\s+/g, " ");
}

function stripControls(raw: string): string {
  let out = "";
  for (const char of raw) {
    const code = char.charCodeAt(0);
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31)) {
      continue;
    }
    out += char;
  }
  return out;
}
