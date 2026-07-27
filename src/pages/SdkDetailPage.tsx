import { Link, useParams } from "react-router-dom";
import {
  ArrowSquareOut,
  BookOpenText,
  GithubLogo,
  Star,
} from "@phosphor-icons/react";
import { TechIcon } from "../components/TechIcon";
import { SdkBrandIcon } from "../components/SdkBrandIcon";
import { Section } from "../components/ui/section";
import { Button } from "@/components/ui/button";
import { getCategory, getLanguage, getSdkBySlug } from "../data";
import { categoryIcons } from "../lib/icons";
import type { LanguageId } from "../types/catalog";

export function SdkDetailPage() {
  const { slug = "" } = useParams();
  const sdk = getSdkBySlug(slug);

  if (!sdk) {
    return (
      <Section className="min-h-[50vh] pt-12">
        <h1 className="text-display-lg text-ink">SDK not found</h1>
        <p className="mt-3 text-body">
          No entry for <code className="font-mono text-sm text-muted">{slug}</code>.{" "}
          <Link to="/browse" className="text-ink hover:text-primary">
            Browse the catalog
          </Link>
        </p>
      </Section>
    );
  }

  return (
    <Section className="min-h-[60vh] pt-12">
      <p className="mb-4 text-sm text-muted">
        <Link to="/browse" className="hover:text-ink">
          SDKs
        </Link>{" "}
        / {sdk.vendor}
      </p>

      <div className="mb-8 flex flex-wrap items-start gap-5">
        <span className="grid h-14 w-14 place-items-center rounded-sm bg-surface-card text-ink ring-1 ring-hairline">
          <SdkBrandIcon sdk={sdk} size={28} />
        </span>
        <div className="min-w-0 max-w-2xl flex-1">
          <h1 className="text-display-xl text-ink">{sdk.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {sdk.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {sdk.official ? (
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body-strong">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Official
              </span>
            ) : null}
            {sdk.featured ? (
              <span className="inline-flex items-center gap-1 rounded-sm bg-surface-card-elevated px-2.5 py-1 text-caption-uppercase text-body-strong">
                <Star weight="fill" className="h-3 w-3 text-accent-cyan" />
                Featured
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Button asChild>
          <a href={sdk.homepage} target="_blank" rel="noreferrer">
            Homepage
            <ArrowSquareOut weight="bold" className="h-4 w-4" />
          </a>
        </Button>
        {sdk.docsUrl ? (
          <Button asChild variant="secondary">
            <a href={sdk.docsUrl} target="_blank" rel="noreferrer">
              <BookOpenText weight="duotone" className="h-4 w-4" />
              Docs
            </a>
          </Button>
        ) : null}
        {sdk.githubUrl ? (
          <Button asChild variant="outline">
            <a href={sdk.githubUrl} target="_blank" rel="noreferrer">
              <GithubLogo weight="duotone" className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline">
          <h2 className="mb-4 text-base font-semibold text-ink">Languages</h2>
          <ul className="flex flex-wrap gap-2">
            {sdk.languages.map((id) => {
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

        <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline">
          <h2 className="mb-4 text-base font-semibold text-ink">Categories</h2>
          <ul className="flex flex-wrap gap-2">
            {sdk.categories.map((id) => {
              const Icon = categoryIcons[id];
              return (
                <li key={id}>
                  <Link
                    to={`/browse?category=${id}`}
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

        {sdk.packages && sdk.packages.length > 0 ? (
          <div className="rounded-sm bg-canvas-deep p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-ink">Packages</h2>
            <ul className="space-y-3 font-mono text-[13px]">
              {sdk.packages.map((pkg) => (
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

        {sdk.skills && sdk.skills.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-ink">
              Agent skills
            </h2>
            <ul className="space-y-3">
              {sdk.skills.map((skill) => (
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

        {sdk.tags && sdk.tags.length > 0 ? (
          <div className="rounded-sm bg-surface-card p-5 ring-1 ring-hairline md:col-span-2">
            <h2 className="mb-3 text-base font-semibold text-ink">Tags</h2>
            <p className="text-body">{sdk.tags.join(" · ")}</p>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
