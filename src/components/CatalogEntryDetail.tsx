import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowSquareOut,
  BookOpenText,
  GithubLogo,
  Plugs,
  Star,
  Terminal,
} from "@phosphor-icons/react";
import { TechIcon } from "./TechIcon";
import { SdkBrandIcon } from "./SdkBrandIcon";
import { Section } from "./ui/section";
import { Button } from "@/components/ui/button";
import {
  getCategory,
  getLanguage,
  relatedCatalog,
} from "../data";
import {
  catalogDetailPath,
  catalogKindMeta,
  catalogListPath,
  withAgentFields,
} from "../lib/catalog";
import { categoryIcons } from "../lib/icons";
import type { CatalogKind, LanguageId, SdkEntry } from "../types/catalog";

const authLabels: Record<NonNullable<SdkEntry["auth"]>, string> = {
  none: "None",
  api_key: "API key",
  oauth: "OAuth",
};

const transportLabels: Record<NonNullable<SdkEntry["transport"]>, string> = {
  stdio: "stdio",
  http: "HTTP",
  sse: "SSE",
};

export function CatalogEntryDetail({
  kind,
  entry,
}: {
  kind: CatalogKind;
  entry: SdkEntry;
}) {
  const meta = catalogKindMeta(kind);
  const listPath = catalogListPath(kind);
  const display = withAgentFields(entry);
  const related = relatedCatalog(entry);
  const relatedItems = [
    related.sdk ? { kind: "sdk" as const, entry: related.sdk } : null,
    related.plugin ? { kind: "plugin" as const, entry: related.plugin } : null,
    related.mcp ? { kind: "mcp" as const, entry: related.mcp } : null,
  ].filter((item): item is { kind: CatalogKind; entry: SdkEntry } =>
    Boolean(item),
  );

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
            {display.transport ? (
              <span className="rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body">
                {transportLabels[display.transport]}
              </span>
            ) : null}
            {display.auth ? (
              <span className="rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body">
                {authLabels[display.auth]}
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

        {kind === "mcp" &&
        (display.transport || display.auth || display.remoteUrl) ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-ink">
              <Plugs weight="duotone" className="h-4 w-4 text-body" />
              Connect
            </h2>
            <dl className="grid gap-3 sm:grid-cols-3">
              {display.transport ? (
                <div>
                  <dt className="text-caption-uppercase text-muted">Transport</dt>
                  <dd className="mt-1 font-mono text-[13px] text-ink">
                    {transportLabels[display.transport]}
                  </dd>
                </div>
              ) : null}
              {display.auth ? (
                <div>
                  <dt className="text-caption-uppercase text-muted">Auth</dt>
                  <dd className="mt-1 font-mono text-[13px] text-ink">
                    {authLabels[display.auth]}
                  </dd>
                </div>
              ) : null}
              {display.remoteUrl ? (
                <div className="sm:col-span-1">
                  <dt className="text-caption-uppercase text-muted">Remote URL</dt>
                  <dd className="mt-1">
                    <a
                      href={display.remoteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all font-mono text-[13px] text-accent-cyan hover:underline"
                    >
                      {display.remoteUrl}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
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

        {relatedItems.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-ink">
              Same product
            </h2>
            <ul className="grid gap-2 sm:grid-cols-3">
              {relatedItems.map(({ entry: relatedEntry }) => (
                <li key={relatedEntry.id}>
                  <Link
                    to={catalogDetailPath(relatedEntry)}
                    className="flex items-center gap-3 rounded-sm bg-surface-card-elevated px-3 py-2.5 text-sm text-ink no-underline hover:ring-1 hover:ring-hairline-strong"
                  >
                    <SdkBrandIcon sdk={relatedEntry} size={16} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {relatedEntry.name}
                      </span>
                      <span className="text-caption-uppercase text-muted">
                        {catalogKindMeta(relatedEntry.kind).label}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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

        {entry.skills && entry.skills.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-ink">
              Agent skills
            </h2>
            <ul className="space-y-3">
              {entry.skills.map((skill) => (
                <li
                  key={skill.url}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                >
                  <a
                    href={skill.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-ink hover:text-primary"
                  >
                    {skill.name}
                  </a>
                  {skill.install ? (
                    <code className="font-mono text-[12px] text-muted">
                      {skill.install}
                    </code>
                  ) : null}
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

export function CatalogMissingDetail({
  kind,
  slug,
}: {
  kind: CatalogKind;
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
