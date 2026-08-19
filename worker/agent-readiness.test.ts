import { describe, expect, test } from "bun:test";
import { pageMarkdown, wantsMarkdown } from "./agent-readiness";
import { llmsFullTxt, llmsTxt, robotsTxt } from "./discovery";

const ORIGIN = "https://sdks.directory";

describe("wantsMarkdown", () => {
  test("browsers asking for HTML keep the SPA", () => {
    expect(
      wantsMarkdown(
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ),
    ).toBe(false);
  });

  test("curl default Accept gets the catalog document", () => {
    expect(wantsMarkdown("*/*")).toBe(true);
    expect(wantsMarkdown("")).toBe(true);
  });

  test("explicit markdown still wins", () => {
    expect(wantsMarkdown("text/markdown")).toBe(true);
    expect(wantsMarkdown("text/markdown, text/html;q=0.8")).toBe(true);
  });
});

describe("agent discovery documents", () => {
  test("homepage markdown answers the four-curl questions", () => {
    const home = pageMarkdown(ORIGIN, "/") ?? "";
    expect(home).toContain("sdks.directory is a public catalog");
    expect(home).toContain("/llms.txt");
    expect(home).toContain("/api/sdks");
    expect(home).toContain("/api/mcp");
    expect(home).toContain("/api/search?q=");
  });

  test("robots and llms point at the API", () => {
    const robots = robotsTxt(ORIGIN);
    expect(robots).toContain("Sitemap: https://sdks.directory/sitemap.xml");
    expect(robots).toContain("/llms-full.txt");
    expect(llmsTxt(ORIGIN)).toContain("/api/search?q=");
    expect(llmsFullTxt(ORIGIN)).toContain("/api/sdks/stripe?view=agent");
    expect(llmsFullTxt(ORIGIN)).toContain("/api/mcps/github");
  });
});
