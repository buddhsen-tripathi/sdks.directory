/** Catalog verticals. SDKs first; plugins & MCPs share this shape later. */
export type CatalogKind = "sdk" | "plugin" | "mcp";

export type LanguageId =
  | "python"
  | "javascript"
  | "typescript"
  | "nodejs"
  | "go"
  | "rust"
  | "java"
  | "kotlin"
  | "swift"
  | "ruby"
  | "php"
  | "csharp"
  | "dart"
  | "cpp"
  | "c"
  | "scala"
  | "elixir"
  | "shell";

export type CategoryId =
  | "ai"
  | "auth"
  | "payments"
  | "cloud"
  | "database"
  | "comms"
  | "analytics"
  | "storage"
  | "devtools"
  | "observability"
  | "security"
  | "media"
  | "maps"
  | "email"
  | "infrastructure";

export interface PackageRef {
  registry: "npm" | "pypi" | "crates" | "maven" | "nuget" | "rubygems" | "packagist" | "go" | "pub" | "other";
  name: string;
  url: string;
}

/** Agent skill linked to an SDK (upstream SKILL.md / skills.sh). */
export interface SkillRef {
  name: string;
  url: string;
  /** Optional install hint, e.g. `npx skills add cloudflare/skills` */
  install?: string;
  /** When set, skill applies only to these languages (omit = all SDK languages). */
  languages?: LanguageId[];
}

/** Flattened skill for `GET /api/skills` (includes owning SDK slug). */
export interface SkillListing extends SkillRef {
  sdk: string;
}

/**
 * Skill payload returned by the agent API when bodies are included.
 * `content` is the full SKILL.md so agents need no follow-up hop.
 */
export interface SkillWithContent extends SkillListing {
  key: string;
  description?: string;
  content?: string;
  contentSource?: string;
  contentFetchedAt?: string;
  hasContent: boolean;
}

export interface SdkEntry {
  id: string;
  kind: CatalogKind;
  name: string;
  slug: string;
  description: string;
  vendor: string;
  languages: LanguageId[];
  categories: CategoryId[];
  homepage: string;
  docsUrl?: string;
  githubUrl?: string;
  packages?: PackageRef[];
  /** Agent skills that teach correct use of this SDK */
  skills?: SkillRef[];
  tags?: string[];
  featured?: boolean;
  official?: boolean;
}

export interface LanguageMeta {
  id: LanguageId;
  name: string;
  shortName: string;
  color: string;
  aliases?: string[];
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  description: string;
}
