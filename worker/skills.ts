import type { SkillRef, SkillWithContent } from "../src/types/catalog";
import skillBodies from "../src/data/skill-bodies.json";

export type SkillBodyRecord = {
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

const bodies = skillBodies as {
  generatedAt: string;
  count: number;
  failed: string[];
  skills: Record<string, SkillBodyRecord>;
};

export function skillKey(sdk: string, name: string): string {
  return `${sdk}/${name}`;
}

export function getSkillBody(
  sdk: string,
  name: string,
): SkillBodyRecord | undefined {
  return bodies.skills[skillKey(sdk, name)];
}

export function enrichSkill(
  skill: SkillRef,
  sdk: string,
  opts: { includeBody?: boolean } = {},
): SkillWithContent {
  const key = skillKey(sdk, skill.name);
  const body = bodies.skills[key];
  const base: SkillWithContent = {
    ...skill,
    sdk,
    key,
    description: body?.description,
    hasContent: Boolean(body?.content),
  };

  if (opts.includeBody && body?.content) {
    base.content = body.content;
    base.contentSource = body.source;
    base.contentFetchedAt = body.fetchedAt;
  }

  return base;
}

export function skillBodiesMeta() {
  return {
    generatedAt: bodies.generatedAt,
    count: bodies.count,
    failed: bodies.failed,
  };
}
