import { Link } from "react-router-dom";
import { LanguageGrid } from "../components/LanguageGrid";
import { Section, SectionHead } from "../components/ui/section";
import { getLanguageCounts, languages } from "../data";

export function LanguagesPage() {
  const counts = getLanguageCounts();
  const total = languages.filter((lang) => (counts[lang.id] ?? 0) > 0).length;

  return (
    <Section className="min-h-[60vh] pt-12">
      <SectionHead
        eyebrow="Languages"
        title="Every language we index"
        description={
          <>
            {total} languages with at least one SDK.{" "}
            <Link to="/browse" className="text-ink hover:text-primary">
              Or browse everything →
            </Link>
          </>
        }
      />
      <LanguageGrid />
    </Section>
  );
}
