import { Link, useParams } from "react-router-dom";
import { SdkGrid } from "../components/SdkGrid";
import { TechIcon } from "../components/TechIcon";
import { Section, SectionHead } from "../components/ui/section";
import { getLanguage, getSdksByLanguage } from "../data";
import type { LanguageId } from "../types/catalog";

export function LanguagePage() {
  const { langId = "" } = useParams();
  const language = getLanguage(langId);

  if (!language) {
    return (
      <Section className="min-h-[50vh] pt-12">
        <h1 className="text-display-lg text-ink">Language not found</h1>
        <p className="mt-3 text-body">
          No language matches{" "}
          <code className="font-mono text-sm text-muted">{langId}</code>.{" "}
          <Link to="/languages" className="text-ink hover:text-primary">
            See all languages
          </Link>
        </p>
      </Section>
    );
  }

  const list = getSdksByLanguage(language.id as LanguageId);

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead
        eyebrow="Language"
        title={
          <span className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-sm bg-surface-card ring-1 ring-hairline">
              <TechIcon
                languageId={language.id as LanguageId}
                size={24}
                color={language.color}
              />
            </span>
            {language.name} SDKs
          </span>
        }
        description={
          <>
            {list.length} SDK{list.length === 1 ? "" : "s"} with {language.name}{" "}
            support.{" "}
            <Link to="/browse" className="text-ink hover:text-primary">
              Filter the full catalog →
            </Link>
          </>
        }
      />
      <SdkGrid
        sdks={list}
        emptyMessage={`No SDKs listed for ${language.name} yet.`}
      />
    </Section>
  );
}
