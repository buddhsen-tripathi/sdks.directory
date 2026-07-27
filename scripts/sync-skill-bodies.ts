/**
 * Snapshot upstream SKILL.md bodies into src/data/skill-bodies.json so the
 * Worker can return full skill content to agents in a single request.
 *
 * Usage: bun run scripts/sync-skill-bodies.ts
 * Resumes existing keys; prefers GitHub raw to avoid skills.sh rate limits.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { sdks } from "../src/data/sdks";

const OUT = resolve(import.meta.dirname, "../src/data/skill-bodies.json");
const UA = "sdks.directory/0.1 (+https://sdks.directory; skill-sync)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type SkillFile = { path: string; contents: string };

type SkillBodyEntry = {
  key: string;
  sdk: string;
  name: string;
  url: string;
  source?: string;
  description?: string;
  content: string;
  fetchedAt: string;
  resolver: string;
};

type DownloadResponse = {
  files?: SkillFile[];
  snapshotHash?: string;
};

function parseFrontmatterDescription(md: string): string | undefined {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return undefined;
  const block = match[1];
  const desc =
    block.match(/^description:\s*>-?\s*\n((?:[ \t]+.+\n?)+)/m)?.[1] ??
    block.match(/^description:\s*['"]([\s\S]*?)['"]\s*$/m)?.[1] ??
    block.match(/^description:\s*(.+)$/m)?.[1];
  return desc?.replace(/\n\s+/g, " ").replace(/^['"]|['"]$/g, "").trim();
}

function looksLikeSkillMd(content: string): boolean {
  return (
    content.length > 40 &&
    (content.startsWith("---") || /(?:^|\n)name:\s*\S+/.test(content)) &&
    !content.trimStart().startsWith("<!DOCTYPE") &&
    !content.trimStart().startsWith("<html")
  );
}

/** owner/repo from skills.sh URL or `npx skills add owner/repo` install hint. */
function ownerRepoFromRefs(url: string, install?: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "skills.sh" || u.hostname === "www.skills.sh") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    }
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    }
  } catch {
    /* ignore */
  }
  const fromInstall = install?.match(
    /skills\s+add\s+(?:https?:\/\/github\.com\/)?([^\s/]+\/[^\s/]+)/i,
  );
  return fromInstall?.[1]?.replace(/\.git$/, "") ?? null;
}

function skillsShDownloadCandidates(
  url: string,
  skillName: string,
  install?: string,
): string[] {
  const out: string[] = [];
  try {
    const u = new URL(url);
    if (u.hostname === "skills.sh" || u.hostname === "www.skills.sh") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 3) out.push(parts.slice(0, 3).join("/"));
      if (parts.length >= 2) out.push(`${parts[0]}/${parts[1]}/${skillName}`);
    }
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        const owner = parts[0];
        const repo = parts[1];
        out.push(`${owner}/${repo}/${skillName}`);
        const skillsIdx = parts.indexOf("skills");
        if (skillsIdx >= 0 && parts[skillsIdx + 1]) {
          out.push(`${owner}/${repo}/${parts[skillsIdx + 1]}`);
        }
      }
    }
  } catch {
    /* ignore */
  }
  const ownerRepo = ownerRepoFromRefs(url, install);
  if (ownerRepo) out.push(`${ownerRepo}/${skillName}`);
  return [...new Set(out)];
}

function githubRawCandidates(
  url: string,
  skillName: string,
  install?: string,
): string[] {
  const out: string[] = [];
  const ownerRepos = new Set<string>();

  try {
    const u = new URL(url);
    if (u.hostname === "github.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) ownerRepos.add(`${parts[0]}/${parts[1]}`);
      if (parts.length >= 2) {
        const owner = parts[0];
        const repo = parts[1];
        const branch =
          parts[2] === "tree" || parts[2] === "blob" ? parts[3] : "main";
        const after =
          parts[2] === "tree" || parts[2] === "blob" ? parts.slice(4) : [];
        if (after.length) {
          const base = after.join("/");
          out.push(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${base}/SKILL.md`,
          );
          if (base.endsWith("SKILL.md")) {
            out.push(
              `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${base}`,
            );
          }
        }
      }
    }
    if (u.hostname === "skills.sh" || u.hostname === "www.skills.sh") {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) ownerRepos.add(`${parts[0]}/${parts[1]}`);
    }
  } catch {
    /* ignore */
  }

  const fromRefs = ownerRepoFromRefs(url, install);
  if (fromRefs) ownerRepos.add(fromRefs);

  for (const ownerRepo of ownerRepos) {
    const [owner] = ownerRepo.split("/");
    for (const branch of ["main", "master"]) {
      for (const prefix of [
        `skills/${skillName}`,
        skillName,
        `packages/${skillName}`,
        `.agents/skills/${skillName}`,
        `agent-skills/${skillName}`,
        `plugins/${owner}/skills/${skillName}`,
        `plugins/${skillName}/skills/${skillName}`,
        // Vendor monorepo layouts
        `skills/feature-flags/${skillName}`,
        `skills/experiments/${skillName}`,
        `skills/onboarding/${skillName}`,
        `skills/agentcontrol/${skillName}`,
      ]) {
        out.push(
          `https://raw.githubusercontent.com/${ownerRepo}/${branch}/${prefix}/SKILL.md`,
        );
      }
    }
  }
  return [...new Set(out)];
}

async function fetchText(
  url: string,
): Promise<{ ok: boolean; status: number; text: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json, text/plain, */*" },
      signal: AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } catch {
    return { ok: false, status: 0, text: null };
  }
}

let downloadBudget = 15; // remaining skills.sh download attempts this run

async function fetchDownload(path: string): Promise<DownloadResponse | null> {
  if (downloadBudget <= 0) return null;
  downloadBudget -= 1;
  await sleep(400);
  const { ok, status, text } = await fetchText(
    `https://skills.sh/api/download/${path.split("/").map(encodeURIComponent).join("/")}`,
  );
  if (status === 429) {
    downloadBudget = 0;
    return null;
  }
  if (!ok || !text) return null;
  try {
    return JSON.parse(text) as DownloadResponse;
  } catch {
    return null;
  }
}

function pickSkillMd(files: SkillFile[]): SkillFile | undefined {
  return (
    files.find((f) => f.path === "SKILL.md") ??
    files.find(
      (f) => f.path.endsWith("/SKILL.md") || f.path.endsWith("SKILL.md"),
    )
  );
}

async function resolveSkill(
  sdk: string,
  name: string,
  url: string,
  install?: string,
): Promise<SkillBodyEntry | null> {
  const key = `${sdk}/${name}`;
  const fetchedAt = new Date().toISOString();

  // Prefer GitHub raw (no skills.sh rate limit)
  for (const rawUrl of githubRawCandidates(url, name, install)) {
    const { ok, text } = await fetchText(rawUrl);
    if (ok && text && looksLikeSkillMd(text)) {
      return {
        key,
        sdk,
        name,
        url,
        source: rawUrl,
        description: parseFrontmatterDescription(text),
        content: text,
        fetchedAt,
        resolver: "github-raw",
      };
    }
  }

  for (const path of skillsShDownloadCandidates(url, name, install)) {
    const data = await fetchDownload(path);
    const files = data?.files ?? [];
    const skillMd = pickSkillMd(files);
    if (skillMd?.contents) {
      return {
        key,
        sdk,
        name,
        url,
        source: `skills.sh/api/download/${path}`,
        description: parseFrontmatterDescription(skillMd.contents),
        content: skillMd.contents,
        fetchedAt,
        resolver: "skills.sh-download",
      };
    }
  }

  return null;
}

type ExistingPayload = {
  generatedAt?: string;
  skills?: Record<string, SkillBodyEntry>;
};

const existing: ExistingPayload = existsSync(OUT)
  ? (JSON.parse(readFileSync(OUT, "utf8")) as ExistingPayload)
  : {};
const entries: Record<string, SkillBodyEntry> = { ...(existing.skills ?? {}) };

const skills = sdks.flatMap((sdk) =>
  (sdk.skills ?? []).map((skill) => ({
    sdk: sdk.slug,
    name: skill.name,
    url: skill.url,
    install: skill.install,
  })),
);

const pending = skills.filter((s) => !entries[`${s.sdk}/${s.name}`]);
console.log(
  `Syncing ${pending.length} pending of ${skills.length} (have ${Object.keys(entries).length})…`,
);

const failed: { sdk: string; name: string; url: string }[] = [];

for (const skill of pending) {
  process.stdout.write(`  ${skill.sdk}/${skill.name} … `);
  const entry = await resolveSkill(
    skill.sdk,
    skill.name,
    skill.url,
    skill.install,
  );
  if (!entry) {
    console.log("FAIL");
    failed.push(skill);
    continue;
  }
  entries[entry.key] = entry;
  console.log(`ok (${entry.resolver}, ${entry.content.length}b)`);
}

const stillMissing = skills
  .filter((s) => !entries[`${s.sdk}/${s.name}`])
  .map((s) => `${s.sdk}/${s.name}`);

const payload = {
  generatedAt: new Date().toISOString(),
  count: Object.keys(entries).length,
  failed: stillMissing,
  skills: entries,
};

writeFileSync(OUT, `${JSON.stringify(payload)}\n`);
console.log(
  `\nWrote ${payload.count}/${skills.length} → ${OUT}` +
    (stillMissing.length
      ? `\nStill missing: ${stillMissing.join(", ")}`
      : ""),
);
