/**
 * Central site configuration — names, copy, nav, and external links.
 * Prefer importing from here instead of hardcoding strings across the app.
 */
export const siteConfig = {
  name: "sdks.directory",
  tagline: "SDK catalog for AI agents.",
  description:
    "Look up official client SDKs by name, package, or vendor. Language is a filter — plugins and MCPs are next.",
  titleTemplate: "%s · sdks.directory",
  defaultTitle: "sdks.directory · SDKs for AI agents",

  /** Public site URL when known; used for docs and absolute links. */
  url: "https://sdks.directory",

  github: {
    owner: "buddhsen-tripathi",
    repo: "sdks.directory",
  },

  themeStorageKey: "sdks.directory.theme",

  /** Primary product verticals in header / footer. */
  nav: [
    { to: "/browse", label: "SDKs" },
    { to: "/plugins", label: "Plugins", soon: true },
    { to: "/mcps", label: "MCPs", soon: true },
  ] as const,
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];

export function githubRepoSlug() {
  return `${siteConfig.github.owner}/${siteConfig.github.repo}`;
}

export function githubRepoUrl() {
  return `https://github.com/${githubRepoSlug()}`;
}

export function githubApiRepoUrl() {
  return `https://api.github.com/repos/${githubRepoSlug()}`;
}

export function pageTitle(section?: string) {
  if (!section) return siteConfig.defaultTitle;
  return siteConfig.titleTemplate.replace("%s", section);
}
