import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { HeroChatSearch } from "../components/HeroChatSearch";
import { LanguageGrid } from "../components/LanguageGrid";
import { SdkGrid } from "../components/SdkGrid";
import { Section, SectionHead } from "../components/ui/section";
import { Button } from "@/components/ui/button";
import { getFeaturedSdks, getLanguageCounts, languages, sdks } from "../data";

export function HomePage() {
  const featured = getFeaturedSdks().slice(0, 6);
  const counts = getLanguageCounts();
  const langCount = languages.filter((l) => (counts[l.id] ?? 0) > 0).length;

  useEffect(() => {
    document.title = "sdks.directory · every SDK, by language";
  }, []);

  return (
    <>
      <HeroChatSearch sdkCount={sdks.length} langCount={langCount} />

      <Section>
        <SectionHead
          as="h2"
          eyebrow="Languages"
          title="Browse by language"
          description="Start where your codebase already lives."
        />
        <LanguageGrid limit={12} showAllLink />
      </Section>

      <Section className="pt-0 md:pt-0">
        <SectionHead
          as="h2"
          eyebrow="Featured"
          title="Official clients worth knowing"
          description="Widely used SDKs across the ecosystem."
        />
        <SdkGrid sdks={featured} />
        <div className="mt-5">
          <Button asChild variant="secondary">
            <Link to="/browse">
              Browse the full catalog
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      <section className="relative overflow-hidden border-t border-hairline">
        <div className="spotlight-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-5 py-16 md:px-6">
          <h2 className="text-display-md max-w-xl text-ink">
            Missing an SDK? Add it via a reviewable PR.
          </h2>
          <Button asChild size="lg">
            <a
              href="https://github.com/buddhsen-tripathi/sdks.directory"
              target="_blank"
              rel="noreferrer"
            >
              Contribute on GitHub
              <ArrowRight weight="bold" className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
