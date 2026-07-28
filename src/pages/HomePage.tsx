import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { HeroChatSearch } from "../components/HeroChatSearch";
import { LanguageGrid } from "../components/LanguageGrid";
import { Reveal, RevealItem } from "../components/Reveal";
import { SdkGrid } from "../components/SdkGrid";
import { Section, SectionHead } from "../components/ui/section";
import { Button } from "@/components/ui/button";
import { getFeaturedMcps, getFeaturedPlugins, getFeaturedSdks } from "../data";

export function HomePage() {
  const featured = getFeaturedSdks().slice(0, 6);
  const featuredPlugins = getFeaturedPlugins().slice(0, 3);
  const featuredMcps = getFeaturedMcps().slice(0, 3);

  useEffect(() => {
    document.title = "sdks.directory";
  }, []);

  return (
    <>
      <HeroChatSearch />

      <Section>
        <Reveal>
          <RevealItem>
            <SectionHead
              as="h2"
              eyebrow="Catalog"
              title="Official SDKs"
              description="Browse the index, or jump straight to search."
            />
          </RevealItem>
          <RevealItem>
            <SdkGrid sdks={featured} />
          </RevealItem>
          <RevealItem className="mt-5">
            <Button asChild variant="secondary">
              <Link to="/browse">
                Browse all SDKs
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </Button>
          </RevealItem>
        </Reveal>
      </Section>

      <Section className="pt-4 md:pt-6">
        <Reveal>
          <RevealItem>
            <SectionHead
              as="h2"
              eyebrow="Filter"
              title="By language"
              description="Narrow the catalog by runtime."
            />
          </RevealItem>
          <RevealItem>
            <LanguageGrid limit={12} showAllLink />
          </RevealItem>
        </Reveal>
      </Section>

      <Section className="pt-4 md:pt-6">
        <Reveal>
          <RevealItem>
            <SectionHead
              as="h2"
              eyebrow="Plugins"
              title="Agent plugins"
              description="Installable packages of skills and rules for agent hosts."
            />
          </RevealItem>
          <RevealItem>
            <SdkGrid sdks={featuredPlugins} />
          </RevealItem>
          <RevealItem className="mt-5">
            <Button asChild variant="secondary">
              <Link to="/plugins">
                Browse plugins
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </Button>
          </RevealItem>
        </Reveal>
      </Section>

      <Section className="pt-4 md:pt-6">
        <Reveal>
          <RevealItem>
            <SectionHead
              as="h2"
              eyebrow="MCPs"
              title="Model Context Protocol"
              description="Curated servers agents can connect to."
            />
          </RevealItem>
          <RevealItem>
            <SdkGrid sdks={featuredMcps} />
          </RevealItem>
          <RevealItem className="mt-5">
            <Button asChild variant="secondary">
              <Link to="/mcps">
                Browse MCPs
                <ArrowRight weight="bold" className="h-4 w-4" />
              </Link>
            </Button>
          </RevealItem>
        </Reveal>
      </Section>

      <section className="relative overflow-hidden">
        <div className="spotlight-glow pointer-events-none absolute inset-0 opacity-70" />
        <Reveal className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-5 py-16 md:px-6 md:py-20">
          <RevealItem>
            <h2 className="text-display-md max-w-xl text-ink">
              Missing an entry? Open a PR.
            </h2>
          </RevealItem>
          <RevealItem>
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
          </RevealItem>
        </Reveal>
      </section>
    </>
  );
}
