import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowSquareOut,
  BookOpenText,
  GithubLogo,
  Star,
  Terminal,
} from "@phosphor-icons/react";
import { TechIcon } from "../components/TechIcon";
import { SdkBrandIcon } from "../components/SdkBrandIcon";
import { Section } from "../components/ui/section";
import { Button } from "@/components/ui/button";
import {
  getCategory,
  getLanguage,
  getMcpBySlug,
  getPluginBySlug,
} from "../data";
import { catalogKindMeta, catalogListPath } from "../lib/catalog";
import { categoryIcons } from "../lib/icons";
import type { CatalogKind, LanguageId, SdkEntry } from "../types/catalog";

function CatalogDetail({
  kind,
  entry,
}: {
  kind: CatalogKind;
  entry: SdkEntry;
}) {
  const meta = catalogKindMeta(kind);
  const listPath = catalogListPath(kind);

  useEffect(() => {
    document.title = `${entry.name} · ${meta.label} · sdks.directory`;
  }, [entry.name, meta.label]);

  return (
    <Section className="min-h-[60vh] pt-12">
      <p className="mb-4 text-sm text-muted">
        <Link to={listPath} className="hover:text-ink">
          {meta.plural}
        </Link>{" "}
        / {entry.vendor}
      </p>

      <div className="mb-8 flex flex-wrap items-start gap-5">
        <span className="grid h-14 w-14 place-items-center rounded-sm bg-surface-card text-ink ring-1 ring-hairline">
          <SdkBrandIcon sdk={entry} size={28} />
        </span>
        <div className="min-w-0 max-w-2xl flex-1">
          <h1 className="text-display-xl text-ink">{entry.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {entry.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.official ? (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Official
              </span>
            ) : null}
            {entry.featured ? (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body-strong">
                <Star weight="fill" className="h-3 w-3 text-accent-cyan" />
                Featured
              </span>
            ) : null}
            {entry.platforms?.map((platform) => (
              <span
                key={platform}
                className="rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Button asChild>
          <a href={entry.homepage} target="_blank" rel="noreferrer">
            Homepage
            <ArrowSquareOut weight="bold" className="h-4 w-4" />
          </a>
        </Button>
        {entry.docsUrl ? (
          <Button asChild variant="secondary">
            <a href={entry.docsUrl} target="_blank" rel="noreferrer">
              <BookOpenText weight="duotone" className="h-4 w-4" />
              Docs
            </a>
          </Button>
        ) : null}
        {entry.githubUrl ? (
          <Button asChild variant="outline">
            <a href={entry.githubUrl} target="_blank" rel="noreferrer">
              <GithubLogo weight="duotone" className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {entry.install ? (
          <div className="rounded-sm bg-canvas-deep p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-ink">
              <Terminal weight="duotone" className="h-4 w-4 text-body" />
              Install
            </h2>
            <code className="block overflow-x-auto font-mono text-[13px] text-accent-cyan">
              {entry.install}
            </code>
          </div>
        ) : null}

        {entry.registryName ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-2 text-base font-semibold text-ink">
              MCP Registry
            </h2>
            <code className="font-mono text-[13px] text-body">
              {entry.registryName}
            </code>
          </div>
        ) : null}

        {entry.languages.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline">
            <h2 className="mb-4 text-base font-semibold text-ink">Languages</h2>
            <ul className="flex flex-wrap gap-2">
              {entry.languages.map((id) => {
                const lang = getLanguage(id);
                return (
                  <li key={id}>
                    <Link
                      to={`/languages/${id}`}
                      className="inline-flex items-center gap-2 rounded-md bg-surface-card-elevated px-3 py-1.5 text-sm text-ink no-underline hover:ring-1 hover:ring-hairline-strong"
                    >
                      <TechIcon
                        languageId={id as LanguageId}
                        size={14}
                        color={lang?.color}
                      />
                      {lang?.name ?? id}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div
          className={
            entry.languages.length > 0
              ? "rounded-sm bg-surface-card p-5 ring-1 ring-hairline"
              : "rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2"
          }
        >
          <h2 className="mb-4 text-base font-semibold text-ink">Categories</h2>
          <ul className="flex flex-wrap gap-2">
            {entry.categories.map((id) => {
              const Icon = categoryIcons[id];
              return (
                <li key={id}>
                  <Link
                    to={`${listPath}?category=${id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-surface-card-elevated px-3 py-1.5 text-sm text-ink no-underline hover:ring-1 hover:ring-hairline-strong"
                  >
                    {Icon ? (
                      <Icon weight="duotone" className="h-4 w-4 text-body" />
                    ) : null}
                    {getCategory(id)?.name ?? id}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {entry.packages && entry.packages.length > 0 ? (
          <div className="rounded-sm bg-canvas-deep p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-ink">Packages</h2>
            <ul className="space-y-3 font-mono text-[13px]">
              {entry.packages.map((pkg) => (
                <li
                  key={`${pkg.registry}-${pkg.name}`}
                  className="flex items-baseline gap-3"
                >
                  <span className="w-24 shrink-0 text-muted">{pkg.registry}</span>
                  <a
                    href={pkg.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-cyan hover:underline"
                  >
                    {pkg.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {entry.tags && entry.tags.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-3 text-base font-semibold text-ink">Tags</h2>
            <p className="text-body">{entry.tags.join(" · ")}</p>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function MissingDetail({
  kind,
  slug,
}: {
  kind: "plugin" | "mcp";
  slug: string;
}) {
  const meta = catalogKindMeta(kind);
  const listPath = catalogListPath(kind);

  useEffect(() => {
    document.title = `${meta.label} not found · sdks.directory`;
  }, [meta.label]);

  return (
    <Section className="min-h-[50vh] pt-12">
      <h1 className="text-display-lg text-ink">{meta.label} not found</h1>
      <p className="mt-3 text-body">
        No entry for <code className="font-mono text-sm text-muted">{slug}</code>
        .{" "}
        <Link to={listPath} className="text-ink hover:text-primary">
          Browse {meta.plural}
        </Link>
      </p>
    </Section>
  );
}

export function PluginDetailPage() {
  const { slug = "" } = useParams();
  const entry = getPluginBySlug(slug);
  if (!entry) return <MissingDetail kind="plugin" slug={slug} />;
  return <CatalogDetail kind="plugin" entry={entry} />;
}

export function McpDetailPage() {
  const { slug = "" } = useParams();
  const entry = getMcpBySlug(slug);
  if (!entry) return <MissingDetail kind="mcp" slug={slug} />;
  return <CatalogDetail kind="mcp" entry={entry} />;
}
