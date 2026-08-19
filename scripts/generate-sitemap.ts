/**
 * Writes public/sitemap.xml and public/robots.txt from catalog seed data.
 * Run at build time so static assets work even before Worker routing wins.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from "../worker/discovery";

const ORIGIN = "https://sdks.directory";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "sitemap.xml"), sitemapXml(ORIGIN));
writeFileSync(join(publicDir, "robots.txt"), robotsTxt(ORIGIN));
writeFileSync(join(publicDir, "llms.txt"), llmsTxt(ORIGIN));
writeFileSync(join(publicDir, "llms-full.txt"), llmsFullTxt(ORIGIN));

console.log("Wrote public/sitemap.xml, robots.txt, llms.txt, and llms-full.txt");
