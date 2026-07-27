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
