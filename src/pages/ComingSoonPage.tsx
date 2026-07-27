import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Section, SectionHead } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  useEffect(() => {
    document.title = `${title} · Coming soon · sdks.directory`;
  }, [title]);

  return (
    <Section className="min-h-[60vh] pt-12">
      <div className="mb-4 inline-flex items-center rounded-sm border border-primary/35 bg-primary/10 px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
        Coming soon
      </div>
      <SectionHead
        title={title}
        description={description}
        className="mb-8"
      />
      <Button asChild>
        <Link to="/browse">Browse SDKs</Link>
      </Button>
    </Section>
  );
}

export function PluginsPage() {
  return (
    <ComingSoonPage
      title="Plugins"
      description="Agent plugins will live here — installable extensions indexed the same way as SDKs. The catalog is still being built."
    />
  );
}

export function McpsPage() {
  return (
    <ComingSoonPage
      title="MCPs"
      description="Model Context Protocol servers will be listed here soon — discoverable tools agents can connect to, alongside SDKs and plugins."
    />
  );
}
